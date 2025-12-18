import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let notes = []
  let error = null

  try {
    notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (e: any) {
    error = e.message
    console.error('Database error:', e)
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Мои заметки</h1>
        
        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Ошибка подключения к базе данных</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="text-sm text-red-700">
              <p className="font-semibold mb-2">Для решения проблемы:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Убедитесь, что таблица создана в базе данных</li>
                <li>Выполните миграции Prisma или создайте таблицу вручную через Neon Dashboard</li>
                <li>Проверьте, что DATABASE_URL правильно настроен в Vercel</li>
              </ol>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <p className="text-gray-500">Заметок пока нет</p>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                <p className="text-sm text-gray-500">
                  Создано: {new Date(note.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

