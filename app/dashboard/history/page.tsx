import { auth } from '@/auth'
import { redirect } from 'next/navigation'

/**
 * Страница истории (заглушка)
 */
export default async function HistoryPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/history')
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">История</h1>
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">История действий будет здесь</p>
      </div>
    </div>
  )
}

