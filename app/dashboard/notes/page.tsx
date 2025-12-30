import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { NotesList } from './NotesList'
import { CreateNoteDialog } from './CreateNoteDialog'

/**
 * Страница управления заметками
 */
export default async function NotesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard/notes')
  }

  // Получаем заметки текущего пользователя
  const notes = await (prisma as any).note.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Заметки</h1>
        <CreateNoteDialog />
      </div>

      <NotesList notes={notes} />
    </div>
  )
}

