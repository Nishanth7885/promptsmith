// Node-runtime Auth.js entry. Adds Credentials + Google providers, plus the
// DB-touching callbacks (which Edge can't run).
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db, schema } from '@/db';
import { authConfig } from './auth.config';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const rows = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email.toLowerCase()))
          .limit(1);
        const user = rows[0];
        if (!user || !user.passwordHash || user.disabled) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        } as any;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // On Google sign-in, ensure a users row exists (auto-verified) and pull
    // role/disabled from DB into the JWT. For credentials, the user object
    // returned by `authorize` already carries these.
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true;
      if (!user.email) return false;
      const email = user.email.toLowerCase();
      const existing = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);
      if (existing.length === 0) {
        const adminBootstrap = process.env.ADMIN_BOOTSTRAP_EMAIL?.toLowerCase();
        await db.insert(schema.users).values({
          email,
          name: user.name ?? null,
          image: user.image ?? null,
          role: adminBootstrap === email ? 'admin' : 'user',
          emailVerified: new Date(),
        });
      } else {
        if (existing[0].disabled) return false;
        if (!existing[0].emailVerified) {
          await db
            .update(schema.users)
            .set({ emailVerified: new Date() })
            .where(eq(schema.users.id, existing[0].id));
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      // Credentials: user object came straight from authorize().
      if (user && account?.provider === 'credentials') {
        token.id = (user as any).id;
        token.role = (user as any).role ?? 'user';
        token.emailVerified = (user as any).emailVerified ?? null;
        return token;
      }
      // Google: look up our DB row by email so the JWT carries OUR id + role.
      if (user && account?.provider === 'google' && user.email) {
        const rows = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, user.email.toLowerCase()))
          .limit(1);
        const dbUser = rows[0];
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.emailVerified = dbUser.emailVerified;
        }
        return token;
      }
      // Refresh from DB on `update()` from client, e.g. after profile edit.
      if (trigger === 'update' && token.id) {
        const rows = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, token.id as string))
          .limit(1);
        const u = rows[0];
        if (u) {
          token.role = u.role;
          token.emailVerified = u.emailVerified;
          if (u.disabled) return null as any; // forces session invalidation
        }
      }
      return token;
    },
  },
});
