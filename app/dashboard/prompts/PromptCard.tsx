'use client'

import { useState } from 'react'
import { togglePromptPublic, togglePromptFavorite } from '@/app/actions/prompts'
import { EditPromptDialog } from './EditPromptDialog'
import { Globe, Lock, Copy } from 'lucide-react'

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

interface PromptCardProps {
  prompt: Prompt
  onDelete: (id: string) => void
  isDeleting: boolean
}

/**
 * Карточка промта
 */
export function PromptCard({ prompt, onDelete, isDeleting }: PromptCardProps) {
  const [isPublic, setIsPublic] = useState(prompt.isPublic)
  const [isFavorite, setIsFavorite] = useState(prompt.isFavorite)
  const [isToggling, setIsToggling] = useState(false)

  const handleTogglePublic = async () => {
    setIsToggling(true)
    const result = await togglePromptPublic(prompt.id)
    if (result.success) {
      setIsPublic(!isPublic)
    }
    setIsToggling(false)
  }

  const handleToggleFavorite = async () => {
    setIsToggling(true)
    const result = await togglePromptFavorite(prompt.id)
    if (result.success) {
      setIsFavorite(!isFavorite)
    }
    setIsToggling(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      {/* Заголовок и действия */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-2">
          {prompt.title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleTogglePublic}
            disabled={isToggling}
            className={`p-1 rounded transition-colors ${
              isPublic
                ? 'text-green-600 hover:bg-green-100'
                : 'text-gray-600 hover:bg-gray-100'
            } disabled:opacity-50`}
            title={isPublic ? 'Сделать приватным' : 'Сделать публичным'}
          >
            {isPublic ? (
              <Globe className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleToggleFavorite}
            disabled={isToggling}
            className={`p-1 rounded transition-colors ${
              isFavorite
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
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
        <p className="text-sm text-gray-700 line-clamp-3">
          {prompt.content}
        </p>
      </div>

      {/* Метаданные */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-4">
          {prompt.category && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {prompt.category.category}
            </span>
          )}
          <span>Голосов: {prompt._count.votes}</span>
          <span>
            {new Date(prompt.updatedAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(prompt.content)
            // Можно добавить уведомление о копировании
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
          {prompt.tags.map((tag) => (
            <span
              key={tag.name}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Действия */}
      <div className="flex justify-between gap-2 pt-3 border-t">
        <EditPromptDialog prompt={prompt} />
        <button
          onClick={() => onDelete(prompt.id)}
          disabled={isDeleting}
          className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
        >
          {isDeleting ? '...' : 'Удалить'}
        </button>
      </div>
    </div>
  )
}

