import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'database',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
        const role = (user as { role?: 'user' | 'admin' }).role
        session.user.role = role === 'admin' ? 'admin' : 'user'
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
})

