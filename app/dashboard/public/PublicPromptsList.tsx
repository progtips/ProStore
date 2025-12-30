import { Suspense } from 'react'
import { PublicPromptsListClient } from './PublicPromptsListClient'

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

interface PublicPromptsListProps {
  prompts: Prompt[]
  currentSort: string
  isAuthenticated: boolean
}

/**
 * Обёртка для списка публичных промтов с Suspense
 */
export function PublicPromptsList(props: PublicPromptsListProps) {
  return (
    <Suspense fallback={<div className="text-center py-8">Загрузка...</div>}>
      <PublicPromptsListClient {...props} />
    </Suspense>
  )
}

