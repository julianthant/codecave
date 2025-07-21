declare module 'better-auth/next' {
  import { NextRequest, NextResponse } from 'next/server';
  import { AuthClient } from 'better-auth/react';

  export function handleAuth(client: AuthClient): (
    req: NextRequest
  ) => Promise<NextResponse>;
}

declare module 'better-auth/react' {
  export interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    [key: string]: any;
  }

  export interface Session {
    user: User;
  }

  export interface AuthClient {
    signIn: {
      social: (options: { provider: string; callbackURL: string }) => Promise<any>;
    };
    signOut: () => Promise<any>;
    signUp: any;
    useSession: () => { data: Session | null; isPending: boolean };
    getSession: () => Promise<Session | null>;
    handleCallback: (searchParams: any) => Promise<{ error?: { message: string } }>;
  }

  export function createAuthClient(options: any): AuthClient;
} 