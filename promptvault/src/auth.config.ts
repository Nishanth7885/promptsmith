// Edge-safe Auth.js base config. Imported by middleware.ts (Edge runtime —
// no Node deps, no DB). Full provider list and DB-touching callbacks live
// in auth.ts and override / extend this config there.
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/verify-email',
  },
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  providers: [],
  callbacks: {
    authorized({ request, auth }) {
      const path = request.nextUrl.pathname;
      const isAdminRoute = path.startsWith('/admin');
      const isAccountRoute = path.startsWith('/account');
      if (isAdminRoute) return auth?.user?.role === 'admin';
      if (isAccountRoute) return !!auth?.user;
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as 'user' | 'admin') ?? 'user';
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
