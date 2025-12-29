'use client'

import { useState } from 'react'
import { togglePromptPublic, togglePromptFavorite } from '@/app/actions/prompts'
import { EditPromptDialog } from './EditPromptDialog'
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

interface PromptsTableProps {
  prompts: Prompt[]
}

/**
 * Таблица промтов
 */
export function PromptsTable({ prompts: initialPrompts }: PromptsTableProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
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

  const handleTogglePublic = async (id: string) => {
    setTogglingId(id)
    const result = await togglePromptPublic(id)
    if (result.success && result.prompt) {
      setPrompts(prompts.map(p => p.id === id ? { ...p, isPublic: result.prompt.isPublic } : p))
    }
    setTogglingId(null)
  }

  const handleToggleFavorite = async (id: string) => {
    setTogglingId(id)
    const result = await togglePromptFavorite(id)
    if (result.success && result.prompt) {
      setPrompts(prompts.map(p => p.id === id ? { ...p, isFavorite: result.prompt.isFavorite } : p))
    }
    setTogglingId(null)
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Заголовок
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Описание
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Категория
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Голосов
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Обновлено
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {prompts.map((prompt) => (
            <tr key={prompt.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <button
                    onClick={() => handleToggleFavorite(prompt.id)}
                    disabled={togglingId === prompt.id}
                    className={`mr-2 ${prompt.isFavorite ? 'text-yellow-500' : 'text-gray-300'}`}
                    title={prompt.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                  >
                    <svg className="w-5 h-5" fill={prompt.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-gray-900">{prompt.title}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 max-w-xs truncate">
                  {prompt.description || prompt.content}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {prompt.category ? (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {prompt.category.category}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {prompt._count.votes}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(prompt.updatedAt).toLocaleDateString('ru-RU')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleTogglePublic(prompt.id)}
                  disabled={togglingId === prompt.id}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    prompt.isPublic
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors disabled:opacity-50`}
                >
                  {prompt.isPublic ? 'Публичный' : 'Приватный'}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <EditPromptDialog prompt={prompt} />
                  <button
                    onClick={() => handleDelete(prompt.id)}
                    disabled={deletingId === prompt.id}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    {deletingId === prompt.id ? '...' : 'Удалить'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

