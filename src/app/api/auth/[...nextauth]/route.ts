import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Free Trial',
      credentials: {
        email: { label: 'Work Email', type: 'email' },
      },
      async authorize(credentials) {
        const rawEmail = (credentials?.email || '').toLowerCase().trim();
        if (!rawEmail || !rawEmail.includes('@')) {
          throw new Error('Please enter a valid work email address.');
        }
        const [username, domain] = rawEmail.split('@');
        const company = domain ? domain.split('.')[0].toUpperCase() : 'TRIAL';
        return {
          id: 'trial-' + Date.now(),
          name: `${username.toUpperCase()} (${company})`,
          email: rawEmail,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      try {
        const email = (user.email || '').toLowerCase().trim();
        let firstName: string | null = null;
        let lastName: string | null = null;

        if (email.includes('@')) {
          const [userPart, domainPart] = email.split('@');
          const cleanUser = userPart.replace(/[._+-]/g, ' ');
          firstName = cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1);
          lastName = domainPart; // stores the company domain for lead analytics
        } else if (user.name) {
          const nameParts = user.name.trim().split(' ');
          firstName = nameParts[0] || null;
          lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
        }

        const providerLabel = account?.provider === 'credentials' ? 'free_trial' : (account?.provider || 'google');

        await prisma.loginAttempt.create({
          data: {
            email:     email || 'unknown',
            firstName,
            lastName,
            provider:  providerLabel,
            status:    'success',
          }
        });
      } catch (err) {
        // Log but do NOT block sign-in if DB write fails
        console.error('[NextAuth] Failed to log sign-in event:', err);
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
