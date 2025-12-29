'use client'

import { useState, useEffect } from 'react'
import { PromptCard } from './PromptCard'
import { PromptsTable } from './PromptsTable'
import { deletePrompt } from '@/app/actions/prompts'
import { useRouter } from 'next/navigation'

interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  isPublic: boolean
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  category: { category: string } | null
  tags: { name: string }[]
  _count: { votes: number }
}

interface PromptsListProps {
  prompts: Prompt[]
}

type ViewMode = 'cards' | 'table'

/**
 * Список промтов с переключением между карточками и таблицей
 */
export function PromptsList({ prompts: initialPrompts }: PromptsListProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const router = useRouter()

  // Синхронизируем состояние с пропсами при их изменении
  useEffect(() => {
    setPrompts(initialPrompts)
  }, [initialPrompts])

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот промт?')) {
      return
    }

    setDeletingId(id)
    
    const result = await deletePrompt(id)
    
    if (result.success) {
      setPrompts(prompts.filter(p => p.id !== id))
      router.refresh()
    } else {
      alert(result.error || 'Ошибка при удалении')
    }
    
    setDeletingId(null)
  }

  if (prompts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-600 mb-4">У вас пока нет промтов</p>
        <p className="text-sm text-gray-500">Создайте первый промт, нажав кнопку "Создать промт"</p>
      </div>
    )
  }

  return (
    <div>
      {/* Переключатель вида */}
      <div className="mb-4 flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Карточки
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Таблица
          </button>
        </div>
      </div>

      {/* Отображение в зависимости от выбранного режима */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onDelete={handleDelete}
              isDeleting={deletingId === prompt.id}
            />
          ))}
        </div>
      ) : (
        <PromptsTable prompts={prompts} />
      )}
    </div>
  )
}

