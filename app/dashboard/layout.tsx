import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/auth'
import { MenuLink } from './LayoutClient'

/**
 * Layout для защиты всего раздела /dashboard
 * Двухколоночная сетка с сайдбаром
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Верхняя навигация */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-xl font-bold text-gray-800">
                ProStore
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-gray-700">{session.user.name || session.user.email}</span>
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/' })
                }}
              >
                <button
                  type="submit"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Выйти
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Двухколоночная сетка */}
      <div className="flex">
        {/* Левый сайдбар */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <MenuLink href="/dashboard">Профиль</MenuLink>
            <MenuLink href="/dashboard/prompts">Промты</MenuLink>
            <MenuLink href="/dashboard/favorites">Избранное</MenuLink>
            <MenuLink href="/dashboard/history">История</MenuLink>
            <MenuLink href="/dashboard/settings">Настройки</MenuLink>
          </nav>
        </aside>

        {/* Правая область контента */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
