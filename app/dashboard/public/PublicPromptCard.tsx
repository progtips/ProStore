'use client'

import { useState, useEffect } from 'react'
import { LikeButton } from '../prompts/LikeButton'
import { Globe, Lock, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { togglePromptFavorite } from '@/app/actions/prompts'

interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  createdAt: Date
  owner: {
    id: string
    name: string | null
    image: string | null
  }
  category: { category: string } | null
  tags: { name: string }[]
  _count: {
    votes: number
  }
  likedByMe: boolean
  likesCount: number
  isFavorite?: boolean
  ownerId?: string
}

interface PublicPromptCardProps {
  prompt: Prompt
  isAuthenticated: boolean
}

/**
 * Карточка публичного промта с кнопкой лайка
 */
export function PublicPromptCard({
  prompt: initialPrompt,
  isAuthenticated,
}: PublicPromptCardProps) {
  const router = useRouter()
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isFavorite, setIsFavorite] = useState(initialPrompt.isFavorite || false)
  const [isToggling, setIsToggling] = useState(false)

  // Синхронизируем состояние с пропсами при их изменении
  useEffect(() => {
    setPrompt(initialPrompt)
    setIsFavorite(initialPrompt.isFavorite || false)
  }, [initialPrompt])

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || isToggling) return
    
    setIsToggling(true)
    const result = await togglePromptFavorite(prompt.id)
    if (result.success) {
      setIsFavorite(!isFavorite)
      router.refresh()
    }
    setIsToggling(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200">
      {/* Заголовок */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-2">
          {prompt.title}
        </h3>
        <div className="flex gap-2">
          <div title="Публичный промт">
            <Globe className="w-5 h-5 text-green-500" />
          </div>
          {isAuthenticated && prompt.ownerId && (
            <button
              onClick={handleToggleFavorite}
              disabled={isToggling}
              className={`p-1 rounded transition-colors ${
                isFavorite
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-gray-400 hover:text-yellow-500'
              } disabled:opacity-50`}
              title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            >
              <svg
                className="w-5 h-5"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Описание */}
      {prompt.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {prompt.description}
        </p>
      )}

      {/* Содержимое (превью) */}
      <div className="bg-gray-50 rounded p-3 mb-3">
        <p className="text-sm text-gray-700 line-clamp-3">{prompt.content}</p>
      </div>

      {/* Метаданные */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-4">
          {prompt.category && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {prompt.category.category}
            </span>
          )}
          <span>
            {new Date(prompt.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(prompt.content)
          }}
          className="p-1.5 rounded transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          title="Копировать содержимое промта"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      {/* Теги */}
      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {prompt.tags.map((tag: any) => (
            <span
              key={tag.name}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Кнопка лайка */}
      <div className="flex items-center justify-between pt-3 border-t">
        <LikeButton
          promptId={prompt.id}
          initialLiked={prompt.likedByMe}
          initialCount={prompt.likesCount}
          disabled={!isAuthenticated}
        />
        {!isAuthenticated && (
          <span className="text-xs text-gray-500">
            Войдите, чтобы ставить лайки
          </span>
        )}
      </div>
    </div>
  )
}

