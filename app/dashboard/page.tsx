import { auth } from '@/auth'
import { redirect } from 'next/navigation'

/**
 * Страница профиля пользователя
 */
export default async function DashboardPage() {
  const session = await auth()

  // Проверка авторизации в server component (не в middleware)
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Личный кабинет</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Информация о пользователе</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {session.user.name && (
                <p><span className="font-medium">Имя:</span> {session.user.name}</p>
              )}
              <p><span className="font-medium">ID:</span> {session.user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

