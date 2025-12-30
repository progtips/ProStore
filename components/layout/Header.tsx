import Link from 'next/link'
import { auth, signOut } from '@/auth'
import { LogIn, LogOut } from 'lucide-react'
import { Logo } from './Logo'

/**
 * Header компонент с навигацией и кнопкой входа/выхода
 */
export async function Header() {
  const session = await auth()

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Лого и навигация */}
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Главная
              </Link>
              <Link
                href="/dashboard/public"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Каталог
              </Link>
              {session?.user && (
                <Link
                  href="/dashboard/prompts"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Мои промты
                </Link>
              )}
            </nav>
          </div>

          {/* Правая часть: авторизация */}
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="hidden sm:inline text-gray-700 text-sm">
                  {session.user.name || session.user.email}
                </span>
                <form
                  action={async () => {
                    'use server'
                    await signOut({ redirectTo: '/' })
                  }}
                >
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Выйти"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Выйти</span>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Войти</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

