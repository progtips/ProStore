'use client'

import { LikeButton } from '../prompts/LikeButton'
import { MessageSquare, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
}

interface PublicPromptCardProps {
  prompt: Prompt
  isAuthenticated: boolean
}

/**
 * Карточка публичного промта с кнопкой лайка
 */
export function PublicPromptCard({
  prompt,
  isAuthenticated,
}: PublicPromptCardProps) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200">
      {/* Заголовок */}
      <div className="flex justify-between items-start mb-3" title="Публичный промт">
        <div className="flex items-center gap-2 flex-1 pr-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">
            {prompt.title}
          </h3>
        </div>
        <Globe className="w-5 h-5 text-green-500" />
      </div>

      {/* Автор */}
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        {prompt.owner.image && (
          <img
            src={prompt.owner.image}
            alt={prompt.owner.name || 'Автор'}
            className="w-6 h-6 rounded-full"
          />
        )}
        <span>{prompt.owner.name || 'Анонимный пользователь'}</span>
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
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        {prompt.category && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {prompt.category.category}
          </span>
        )}
        <span>Голосов: {prompt._count.votes}</span>
        <span>
          {new Date(prompt.createdAt).toLocaleDateString('ru-RU')}
        </span>
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

