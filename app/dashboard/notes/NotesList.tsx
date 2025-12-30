'use client'

import { useState, useEffect } from 'react'
import { NoteCard } from './NoteCard'
import { deleteNote } from '@/app/actions/notes'
import { useRouter } from 'next/navigation'

interface Note {
  id: string
  title: string
  createdAt: Date
}

interface NotesListProps {
  notes: Note[]
}

/**
 * Список заметок в виде карточек
 */
export function NotesList({ notes: initialNotes }: NotesListProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  // Синхронизируем состояние с пропсами
  useEffect(() => {
    setNotes(initialNotes)
  }, [initialNotes])

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту заметку?')) {
      return
    }

    setDeletingId(id)
    
    const result = await deleteNote(id)
    
    if (result.success) {
      setNotes(notes.filter(n => n.id !== id))
      router.refresh()
    } else {
      alert(result.error || 'Ошибка при удалении заметки')
    }
    
    setDeletingId(null)
  }

  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-600 mb-4">У вас пока нет заметок</p>
        <p className="text-sm text-gray-500">Создайте первую заметку, нажав кнопку "Создать заметку"</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={handleDelete}
          isDeleting={deletingId === note.id}
        />
      ))}
    </div>
  )
}

