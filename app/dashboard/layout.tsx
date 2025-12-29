import { auth } from '@/auth'
import { redirect } from 'next/navigation'

/**
 * Layout для защиты всего раздела /dashboard
 * Если пользователь не авторизован, редиректим на /login
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  return <>{children}</>
}

