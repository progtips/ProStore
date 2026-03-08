'use client'

import { useState, useEffect } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  category: string
}

interface CategoriesTableProps {
  categories: Category[]
}

export function CategoriesTable({ categories: initialCategories }: CategoriesTableProps) {
  const [categories, setCategories] = useState(initialCategories)
  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditValue(cat.category)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    setIsSubmitting(true)
    const result = await updateCategory(editingId, editValue)
    if (result.success) {
      setCategories(cats => cats.map(c => c.id === editingId ? { ...c, category: editValue.trim() } : c))
      setEditingId(null)
      router.refresh()
    } else {
      alert(result.error)
    }
    setIsSubmitting(false)
  }

  const handleCreate = async () => {
    if (!newCategory.trim()) return
    setIsSubmitting(true)
    const formData = new FormData()
    formData.set('category', newCategory.trim())
    const result = await createCategory(formData)
    if (result.success) {
      setNewCategory('')
      setShowCreate(false)
      router.refresh()
    } else {
      alert(result.error)
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту категорию? Промты с этой категорией станут без категории.')) return
    setIsSubmitting(true)
    const result = await deleteCategory(id)
    if (result.success) {
      setCategories(cats => cats.filter(c => c.id !== id))
      router.refresh()
    } else {
      alert(result.error)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Список категорий</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Добавить категорию
        </button>
      </div>

      {showCreate && (
        <div className="p-4 bg-gray-50 border-b flex gap-3 items-center">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Название категории"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button
            onClick={handleCreate}
            disabled={isSubmitting || !newCategory.trim()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Сохранить
          </button>
          <button
            onClick={() => { setShowCreate(false); setNewCategory('') }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Отмена
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      autoFocus
                    />
                  ) : (
                    <span className="text-gray-900">{cat.category}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === cat.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSubmitting}
                        className="text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditValue('') }}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && !showCreate && (
        <div className="p-8 text-center text-gray-500">
          Нет категорий. Нажмите «Добавить категорию», чтобы создать первую.
        </div>
      )}
    </div>
  )
}
