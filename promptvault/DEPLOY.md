# Deploying Prompt Smith to a GCP Ubuntu VM

End-to-end walkthrough for `promptsmith.ink` on a single Ubuntu 22.04 VM. Plan: **Nginx → Node (systemd) → SQLite**, with Let's Encrypt certs via Certbot.

You'll do everything by SSH'ing in and running the commands below in order. Read each section before pasting.

## 0. What you need before you start

- A GCP VM running Ubuntu 22.04 LTS (e2-small or larger is fine to start).
- The VM's external IP.
- Root or sudo SSH access.
- DNS access for `promptsmith.ink` at your registrar.
- Production Cashfree keys (already generated).
- A Resend API key + a verified sender domain (`promptsmith.ink`).
- Google OAuth client ID + secret (free).

## 1. Point DNS at the VM

In your domain registrar's DNS panel:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A    | @    | `<VM external IP>` | 300 |
| A    | www  | `<VM external IP>` | 300 |

Wait until `dig +short promptsmith.ink` returns the VM's IP from your laptop. Don't move on until DNS resolves — Certbot will fail otherwise.

## 2. Open the GCP firewall

In GCP console → VPC network → Firewall → make sure rules allow:

- TCP 22 (SSH) from your IP
- TCP 80 (HTTP) from `0.0.0.0/0`
- TCP 443 (HTTPS) from `0.0.0.0/0`

The default network usually has `default-allow-http` and `default-allow-https` ready to apply by adding the `http-server` and `https-server` tags to the VM.

## 3. Bootstrap the VM

SSH in, then:

```bash
sudo apt update
sudo apt install -y git
git clone <your-repo-url> /tmp/promptsmith
cd /tmp/promptsmith/promptvault
sudo bash deploy/bootstrap.sh
```

This installs Node 20, Nginx, Certbot, and creates the `promptsmith` service user and directories.

> If you don't have a git repo yet, just `scp` the `promptvault/` directory up to the VM instead of cloning.

## 4. Build the app

Still on the VM, from `/tmp/promptsmith/promptvault`:

```bash
sudo -u promptsmith bash -c '
  set -e
  RELEASE_DIR=/opt/promptsmith/releases/$(date +%Y%m%d%H%M%S)
  mkdir -p "$RELEASE_DIR"
  rsync -a --exclude=node_modules --exclude=.next --exclude=/data /tmp/promptsmith/promptvault/ "$RELEASE_DIR"/
  cd "$RELEASE_DIR"
  npm ci --omit=dev
  npm run prompts:build
  npm run build
  # Standalone bundle excludes static + public — copy them over.
  cp -r .next/static .next/standalone/.next/static
  cp -r public .next/standalone/public
  ln -sfn "$RELEASE_DIR" /opt/promptsmith/current
'
```

`/opt/promptsmith/current` is now the symlink the systemd unit will use.

> **Why `--exclude=/data`** (with leading slash) and not `--exclude=data`: rsync treats an unanchored pattern like `data` as "match any directory named `data` anywhere" — which would also exclude `src/data/prompts/` where the 4,029 prompt JSONs live, and the build would fail. The leading slash anchors the pattern to the rsync source root so only top-level `data/` (holding the SQLite file + legacy `orders.jsonl`) is skipped.

## 5. Drop in the env file

```bash
sudo cp /tmp/promptsmith/promptvault/deploy/promptsmith.env.template /etc/promptsmith.env
sudo chmod 600 /etc/promptsmith.env
sudo chown root:root /etc/promptsmith.env
sudo nano /etc/promptsmith.env
```

Fill in every `__REPLACE_ME__`:

- `AUTH_SECRET` — `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `PROMPTSMITH_GRANT_SECRET` — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from Google Cloud Console (see §9 below)
- `RESEND_API_KEY` — from resend.com
- `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY` — production keys from Cashfree dashboard
- `ADMIN_BOOTSTRAP_EMAIL` — your email (the first signup with this email becomes admin)

Save. Re-confirm `chmod 600 /etc/promptsmith.env` so it's not world-readable.

## 6. Initialize the database

```bash
cd /opt/promptsmith/current
sudo -u promptsmith DATABASE_URL="file:/var/lib/promptsmith/promptsmith.db" \
  node -e 'require("dotenv").config({path:"/etc/promptsmith.env"})' || true
sudo -u promptsmith env $(grep -v '^#' /etc/promptsmith.env | xargs) npm run db:migrate
sudo -u promptsmith env $(grep -v '^#' /etc/promptsmith.env | xargs) npm run db:seed
```

(The `env $(grep …)` pattern loads the env file into the subprocess so the migrate/seed scripts see `DATABASE_URL`.)

## 7. Install + start the systemd unit

```bash
sudo cp /tmp/promptsmith/promptvault/deploy/promptsmith.service /etc/systemd/system/promptsmith.service
sudo systemctl daemon-reload
sudo systemctl enable --now promptsmith
sudo systemctl status promptsmith --no-pager
```

Check logs if it doesn't start:

```bash
sudo journalctl -u promptsmith -n 200 --no-pager
```

The service should be listening on `127.0.0.1:3000`. Test:

```bash
curl -I http://127.0.0.1:3000
```

## 8. Configure Nginx + Let's Encrypt

```bash
sudo cp /tmp/promptsmith/promptvault/deploy/nginx.conf /etc/nginx/sites-available/promptsmith
sudo ln -s /etc/nginx/sites-available/promptsmith /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Issue the cert + auto-edit the nginx conf to add SSL listeners
sudo certbot --nginx -d promptsmith.ink -d www.promptsmith.ink \
  --non-interactive --agree-tos -m hello@promptsmith.ink

# Auto-renew is installed as a systemd timer by the certbot package; verify:
sudo systemctl list-timers | grep certbot
```

Visit `https://promptsmith.ink` — you should see the landing page over TLS.

## 9. Google OAuth setup

In [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials):

1. Create OAuth 2.0 Client ID → Application type: Web application.
2. Authorized JavaScript origins: `https://promptsmith.ink`
3. Authorized redirect URIs: `https://promptsmith.ink/api/auth/callback/google`
4. Copy Client ID + Secret into `/etc/promptsmith.env`. Restart: `sudo systemctl restart promptsmith`.
5. Configure the OAuth consent screen (External, Production). For a personal-account app, you can stay in Testing mode initially with up to 100 testers.

## 10. Cashfree dashboard — production webhook

In Cashfree dashboard → Developers → Webhooks:

- URL: `https://promptsmith.ink/api/cashfree/webhook`
- Events: subscribe to **PAYMENT_SUCCESS_WEBHOOK** and **PAYMENT_FAILED_WEBHOOK** at minimum.
- The signature secret is your `CASHFREE_SECRET_KEY` — already in the env file.

Make a tiny test purchase end-to-end (₹1 special order from the dashboard if possible, or just buy with a real card and refund). Confirm:

- Order shows up in `/admin/orders` as `PAID`.
- The buyer received the receipt email.
- Webhook was hit (check `journalctl -u promptsmith -f`).

## 11. First admin login

Sign up at `https://promptsmith.ink/signup` with the email you set in `ADMIN_BOOTSTRAP_EMAIL`. Verify your email. Log in. You'll see the **Admin** link in the header → `/admin`.

## 12. Day-2 ops

**Deploying a new version:**

```bash
# On your laptop, scp the new code to /tmp/promptsmith on the VM, then:
ssh promptsmith-vm
sudo -u promptsmith bash -c '
  set -e
  RELEASE_DIR=/opt/promptsmith/releases/$(date +%Y%m%d%H%M%S)
  mkdir -p "$RELEASE_DIR"
  rsync -a --exclude=node_modules --exclude=.next --exclude=/data /tmp/promptsmith/promptvault/ "$RELEASE_DIR"/
  cd "$RELEASE_DIR"
  npm ci --omit=dev
  npm run prompts:build
  npm run build
  cp -r .next/static .next/standalone/.next/static
  cp -r public .next/standalone/public
'
sudo -u promptsmith env $(grep -v '^#' /etc/promptsmith.env | xargs) bash -c '
  cd /opt/promptsmith/releases/$(ls -t /opt/promptsmith/releases | head -1)
  npm run db:migrate
'
sudo ln -sfn /opt/promptsmith/releases/$(ls -t /opt/promptsmith/releases | head -1) /opt/promptsmith/current
sudo systemctl restart promptsmith
```

**Database backup (daily):**

```bash
sudo crontab -e
# Add:
0 3 * * * sqlite3 /var/lib/promptsmith/promptsmith.db ".backup /var/backups/promptsmith-$(date +\%F).db" && find /var/backups -name 'promptsmith-*.db' -mtime +30 -delete
```

**Rotate Cashfree secret (every 6–12 months):**

1. Generate new key in Cashfree dashboard.
2. Edit `/etc/promptsmith.env`, paste the new `CASHFREE_SECRET_KEY`.
3. `sudo systemctl restart promptsmith`.
4. Update the webhook secret in the Cashfree dashboard if it changed.

**Monitoring:**

- App logs: `sudo journalctl -u promptsmith -f`
- Nginx access: `sudo tail -f /var/log/nginx/access.log`
- Certbot renewals: `sudo systemctl list-timers | grep certbot`

## Troubleshooting

| Symptom | Look at |
|---------|---------|
| 502 Bad Gateway | `sudo journalctl -u promptsmith -n 200` — Node likely crashed. Often missing env var. |
| Auth.js loops on login | `AUTH_URL` and `AUTH_TRUST_HOST=true` set? `NEXT_PUBLIC_APP_URL` matches the actual domain? |
| Webhook signature fails | `CASHFREE_SECRET_KEY` in env matches what Cashfree dashboard shows? |
| Google OAuth `redirect_uri_mismatch` | Authorized redirect URI in Google must be exactly `https://promptsmith.ink/api/auth/callback/google` (no trailing slash). |
| Receipt email not arriving | Resend dashboard → Activity. Sender domain verified? Check `journalctl -u promptsmith` for `[receipt-email]` warnings. |
| `database is locked` errors | Make sure only one process writes to the SQLite file. WAL is on, but parallel deploys still need to stop the old one first. |
