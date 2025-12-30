'use client'

import { FileText } from 'lucide-react'

interface Note {
  id: string
  title: string
  createdAt: Date
}

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
  isDeleting: boolean
}

/**
 * Карточка заметки
 */
export function NoteCard({ note, onDelete, isDeleting }: NoteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200">
      {/* Заголовок */}
      <div className="flex items-start gap-2 mb-3">
        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
        <h3 className="text-lg font-semibold text-gray-800 flex-1">
          {note.title}
        </h3>
      </div>

      {/* Метаданные */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>
          {new Date(note.createdAt).toLocaleDateString('ru-RU')}
        </span>
      </div>

      {/* Действия */}
      <div className="flex justify-end gap-2 pt-3 border-t">
        <button
          onClick={() => onDelete(note.id)}
          disabled={isDeleting}
          className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
        >
          {isDeleting ? '...' : 'Удалить'}
        </button>
      </div>
    </div>
  )
}

