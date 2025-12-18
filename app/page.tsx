import { prisma } from '@/lib/prisma'

export default async function Home() {
  const notes = await prisma.note.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Мои заметки</h1>
        
        {notes.length === 0 ? (
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

