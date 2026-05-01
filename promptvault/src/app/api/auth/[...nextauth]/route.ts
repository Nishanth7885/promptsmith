// Auth.js v5 route handler. Catches /api/auth/signin, /callback, /signout,
// /session, /csrf, /providers, etc.
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
