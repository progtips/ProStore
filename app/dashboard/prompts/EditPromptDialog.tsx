'use client'

import { useState } from 'react'
import { updatePrompt } from '@/app/actions/prompts'
import { useRouter } from 'next/navigation'

interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  isPublic: boolean
}

interface EditPromptDialogProps {
  prompt: Prompt
}

/**
 * Диалог редактирования промта
 */
export function EditPromptDialog({ prompt }: EditPromptDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append('id', prompt.id)
    
    const result = await updatePrompt(formData)

    if (result.success) {
      setIsOpen(false)
      router.refresh()
    } else {
      alert(result.error || 'Ошибка при обновлении промта')
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
      >
        Редактировать
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Редактировать промт</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Заголовок *
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  required
                  maxLength={200}
                  defaultValue={prompt.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <input
                  type="text"
                  id="edit-description"
                  name="description"
                  maxLength={500}
                  defaultValue={prompt.description || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-1">
                  Содержимое *
                </label>
                <textarea
                  id="edit-content"
                  name="content"
                  required
                  rows={8}
                  defaultValue={prompt.content}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-isPublic"
                  name="isPublic"
                  value="true"
                  defaultChecked={prompt.isPublic}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="edit-isPublic" className="ml-2 text-sm text-gray-700">
                  Сделать публичным
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

