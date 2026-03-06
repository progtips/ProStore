'use client'

import { useState, useEffect } from 'react'
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
  const [formData, setFormData] = useState({ title: '', description: '', content: '', isPublic: false })
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: prompt.title,
        description: prompt.description || '',
        content: prompt.content,
        isPublic: prompt.isPublic,
      })
    }
  }, [isOpen, prompt])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataObj = new FormData()
    formDataObj.append('id', prompt.id)
    formDataObj.append('title', formData.title)
    formDataObj.append('description', formData.description)
    formDataObj.append('content', formData.content)
    formDataObj.append('isPublic', formData.isPublic ? 'true' : '')
    
    const result = await updatePrompt(formDataObj)

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
        className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
      >
        Правка
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="edit-dialog-panel rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Правка промта</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Заголовок *
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  required
                  maxLength={200}
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-500 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Описание
                </label>
                <input
                  type="text"
                  id="edit-description"
                  name="description"
                  maxLength={500}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-500 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Содержимое *
                </label>
                <textarea
                  id="edit-content"
                  name="content"
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-500 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData((p) => ({ ...p, isPublic: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="edit-isPublic" className="ml-2 text-sm text-gray-700 dark:text-slate-300">
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
                  className="px-4 py-2 border border-gray-300 dark:border-slate-500 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
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

