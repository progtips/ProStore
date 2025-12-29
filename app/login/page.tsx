import { Suspense } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import LoginClient from './LoginClient'

/**
 * Страница логина - редиректит авторизованных пользователей
 */
export default async function LoginPage() {
  const session = await auth()

  // Если пользователь уже авторизован, редиректим в dashboard
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка…</div>}>
      <LoginClient />
    </Suspense>
  )
}
