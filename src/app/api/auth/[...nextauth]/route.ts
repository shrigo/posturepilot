import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // select_account forces Google's simpler account picker UI
          // (bypasses v3 accountchooser which Safari ITP blocks)
          // Unlike 'consent', this does NOT require cross-site refresh token cookies
          prompt: 'select_account',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Cookie configuration for cross-browser compatibility (Safari ITP, Firefox ETP)
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',   // 'lax' works with Safari ITP; 'none' would require third-party cookies
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async signIn({ user, account }) {
      try {
        const nameParts = (user.name || '').trim().split(' ');
        const firstName = nameParts[0] || null;
        const lastName  = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;

        await prisma.loginAttempt.create({
          data: {
            email:     user.email || 'unknown',
            firstName,
            lastName,
            provider:  account?.provider || 'google',
            status:    'success',
          }
        });
      } catch (err) {
        // Log but do NOT block sign-in if DB write fails
        console.error('[NextAuth] Failed to log successful sign-in:', err);
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to correct domain — prevents open redirect issues
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Auth errors go back to login, not a blank error page
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
