// Auth middleware (Edge runtime). The `authorized` callback in
// auth.config.ts returns false for unauthenticated /admin or /account hits;
// Auth.js redirects those to /login.
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
