'use client'

import { useState } from 'react'
import { PromptCard } from './PromptCard'
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

/**
 * Список промтов в виде карточек
 */
export function PromptsList({ prompts: initialPrompts }: PromptsListProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

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
  )
}

