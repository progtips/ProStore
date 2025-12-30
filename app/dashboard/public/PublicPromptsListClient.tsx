'use client'

import { useState, useEffect } from 'react'
import { PublicPromptCard } from './PublicPromptCard'
import { useRouter, useSearchParams } from 'next/navigation'
import { TrendingUp, Clock } from 'lucide-react'

interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  owner: {
    id: string
    name: string | null
    image: string | null
  }
  category: { category: string } | null
  tags: { name: string }[]
  _count: {
    votes: number
    likes: number
  }
  likedByMe: boolean
  likesCount: number
}

interface PublicPromptsListClientProps {
  prompts: Prompt[]
  currentSort: string
  isAuthenticated: boolean
}

/**
 * Клиентский компонент списка публичных промтов с сортировкой
 */
export function PublicPromptsListClient({
  prompts: initialPrompts,
  currentSort,
  isAuthenticated,
}: PublicPromptsListClientProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Синхронизируем состояние с пропсами
  useEffect(() => {
    setPrompts(initialPrompts)
  }, [initialPrompts])

  const handleSortChange = (sort: 'popular' | 'recent') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    router.push(`/dashboard/public?${params.toString()}`)
  }

  if (prompts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-600 mb-4">Публичных промтов пока нет</p>
        <p className="text-sm text-gray-500">
          Будьте первым, кто поделится своим промтом!
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Переключатель сортировки */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          <button
            onClick={() => handleSortChange('popular')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentSort === 'popular'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Популярные
          </button>
          <button
            onClick={() => handleSortChange('recent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentSort === 'recent'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            Новые
          </button>
        </div>
      </div>

      {/* Список карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prompts.map((prompt) => (
          <PublicPromptCard
            key={prompt.id}
            prompt={prompt}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  )
}

