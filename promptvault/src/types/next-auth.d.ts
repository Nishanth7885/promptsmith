import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    role?: 'user' | 'admin';
    emailVerified?: Date | null;
    disabled?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: 'user' | 'admin';
      emailVerified: Date | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'user' | 'admin';
    emailVerified?: Date | null;
    disabled?: boolean;
  }
}
