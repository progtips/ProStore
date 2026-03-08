'use client'

import { useState, useEffect, useCallback } from 'react'
import { getOptimizedImageUrl } from '@/lib/cloudinary-url'
import type { UploadedImage, ImageListResponse } from '@/types/image'

interface ImageGalleryProps {
  promptId?: string
  className?: string
}

/**
 * Галерея изображений пользователя: сетка, пагинация, удаление
 */
export function ImageGallery({ promptId, className = '' }: ImageGalleryProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadImages = useCallback(async (pageNum: number = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: '20' })
      if (promptId) params.set('promptId', promptId)
      const res = await fetch(`/api/images?${params}`)
      const data: ImageListResponse = await res.json()
      if (res.ok) {
        setImages(data.images)
        setTotalPages(data.pagination.totalPages)
      }
    } catch {
      setImages([])
    } finally {
      setLoading(false)
    }
  }, [promptId])

  useEffect(() => {
    loadImages(page)
  }, [loadImages, page])

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить это изображение?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Ошибка удаления')
      }
    } catch {
      alert('Ошибка удаления')
    } finally {
      setDeletingId(null)
    }
  }

  const formatBytes = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading && images.length === 0) {
    return (
      <div className={`flex justify-center py-12 ${className}`}>
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className={`text-center py-12 text-gray-500 ${className}`}>
        <p>Нет загруженных изображений</p>
        <p className="text-sm mt-1">Загрузите изображение в форме создания/редактирования промта</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-[4/3] bg-gray-100 relative">
              <img
                src={getOptimizedImageUrl(img.secureUrl, 'thumbnail')}
                alt={img.alt || 'Изображение'}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleDelete(img.id)}
                disabled={deletingId === img.id}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 transition-colors"
                title="Удалить"
              >
                {deletingId === img.id ? (
                  <span className="w-4 h-4 block border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
            <div className="p-2 text-xs text-gray-500">
              <p>{formatDate(img.createdAt)}</p>
              {img.bytes && <p>{formatBytes(img.bytes)}</p>}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            ← Назад
          </button>
          <span className="px-4 py-2 text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  )
}
