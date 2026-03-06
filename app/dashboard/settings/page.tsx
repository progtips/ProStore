import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getTheme } from '@/lib/theme'
import { ThemeSwitcher } from './ThemeSwitcher'

/**
 * Страница настроек
 */
export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/settings')
  }

  const theme = await getTheme()

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Настройки</h1>
      <div className="bg-white rounded-lg shadow p-8 space-y-8">
        <ThemeSwitcher currentTheme={theme} />
      </div>
    </div>
  )
}

