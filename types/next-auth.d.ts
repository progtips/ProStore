import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role?: 'user' | 'admin'
    } & DefaultSession['user']
  }

  interface User {
    id: string
  }
}

