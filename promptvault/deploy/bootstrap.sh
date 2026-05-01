#!/usr/bin/env bash
# One-time VM bootstrap. Run as root: `sudo bash bootstrap.sh`
# Idempotent — safe to re-run.
set -euo pipefail

DOMAIN="promptsmith.ink"
APP_USER="promptsmith"
APP_DIR="/opt/promptsmith"
DATA_DIR="/var/lib/promptsmith"
NODE_MAJOR=20

log() { printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }

if [[ $EUID -ne 0 ]]; then
  echo "Run as root: sudo bash bootstrap.sh" >&2
  exit 1
fi

log "Installing system packages"
apt-get update
apt-get install -y curl ca-certificates gnupg build-essential nginx git ufw certbot python3-certbot-nginx

log "Installing Node ${NODE_MAJOR}"
if ! command -v node >/dev/null || ! node -v | grep -q "^v${NODE_MAJOR}"; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
node -v
npm -v

log "Creating service user + directories"
id -u "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /usr/sbin/nologin "$APP_USER"
install -d -o "$APP_USER" -g "$APP_USER" -m 0755 "$APP_DIR" "$APP_DIR/releases"
install -d -o "$APP_USER" -g "$APP_USER" -m 0750 "$DATA_DIR"

log "Configuring firewall (allow 22, 80, 443)"
ufw allow OpenSSH || true
ufw allow 'Nginx Full' || true
yes | ufw enable || true

log "Bootstrap done."
echo
echo "Next steps:"
echo "  1) DNS: point A records for ${DOMAIN} and www.${DOMAIN} to this VM's external IP."
echo "  2) Copy your built app into ${APP_DIR}/current (see DEPLOY.md)."
echo "  3) Drop the env file at /etc/promptsmith.env (chmod 600, owner root)."
echo "  4) Drop the systemd unit at /etc/systemd/system/promptsmith.service."
echo "  5) Drop the nginx config at /etc/nginx/sites-available/promptsmith and link it."
echo "  6) Run certbot: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
