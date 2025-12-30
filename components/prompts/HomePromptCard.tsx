'use client'

import Link from 'next/link'
import { LikeButton } from '@/app/dashboard/prompts/LikeButton'
import { Globe, Calendar } from 'lucide-react'

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
  likedByMe: boolean
  likesCount: number
}

interface HomePromptCardProps {
  prompt: Prompt
  isAuthenticated: boolean
}

/**
 * Карточка промта для главной страницы (без кнопок редактирования)
 * Лайки доступны только авторизованным пользователям
 */
export function HomePromptCard({ prompt, isAuthenticated }: HomePromptCardProps) {
  const hasLikes = prompt.likesCount > 0
  
  return (
    <div className={`rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200 ${
      hasLikes ? 'bg-green-50' : 'bg-white'
    }`}>
      {/* Заголовок */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-2">
          {prompt.title}
        </h3>
        <div className="p-1">
          <Globe className="w-5 h-5 text-green-500" />
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

      {/* Метаданные: дата и категория */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(prompt.createdAt).toLocaleDateString('ru-RU')}</span>
        </div>
        {prompt.category && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {prompt.category.category}
          </span>
        )}
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

      {/* Кнопка лайка и Открыть */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t">
        {isAuthenticated ? (
          <LikeButton
            promptId={prompt.id}
            initialLiked={prompt.likedByMe}
            initialCount={prompt.likesCount}
            disabled={false}
          />
        ) : (
          <div className="text-xs text-gray-500">
            Лайков: {prompt.likesCount}
          </div>
        )}
        <Link
          href={`/prompts/${prompt.id}`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          Открыть
        </Link>
      </div>
    </div>
  )
}

