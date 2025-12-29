import { auth } from '@/auth'
import { redirect } from 'next/navigation'

/**
 * Страница настроек (заглушка)
 */
export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/settings')
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Настройки</h1>
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Настройки будут здесь</p>
      </div>
    </div>
  )
}

