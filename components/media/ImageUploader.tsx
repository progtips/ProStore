'use client'

import { useState, useRef, useCallback } from 'react'
import { validateImageFile } from '@/lib/file-validation'
import type { UploadedImage } from '@/types/image'

interface ImageUploaderProps {
  promptId?: string
  initialImageUrl?: string
  onUploaded?: (image: UploadedImage) => void
  className?: string
}

/**
 * Компонент загрузки изображений: drag-drop, preview, валидация
 */
export function ImageUploader({
  promptId,
  initialImageUrl,
  onUploaded,
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File | null) => {
      setError(null)
      setPreviewUrl(null)

      if (!file) return

      const validation = validateImageFile(file)
      if (validation) {
        setError(validation.error)
        return
      }

      setPreviewUrl(URL.createObjectURL(file))
      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.set('file', file)
        if (promptId) formData.set('promptId', promptId)

        const res = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Ошибка загрузки')
          return
        }

        onUploaded?.(data)
        setPreviewUrl(null)
      } catch (err) {
        setError('Ошибка загрузки изображения')
      } finally {
        setIsUploading(false)
      }
    },
    [promptId, onUploaded]
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type?.startsWith('image/')) {
      handleFile(file)
    } else if (file) {
      setError('Разрешены только изображения (JPEG, PNG, WebP)')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    handleFile(file ?? null)
    e.target.value = ''
  }

  const handleClick = () => {
    if (!isUploading) inputRef.current?.click()
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {(initialImageUrl || previewUrl) && !isUploading ? (
        <div className="relative">
          <img
            src={previewUrl || initialImageUrl}
            alt="Превью"
            className="w-full h-40 object-cover rounded-lg border border-gray-200"
          />
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading ? 'pointer-events-none opacity-70' : ''}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Загрузка...</span>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-1">
                Перетащите изображение сюда или нажмите для выбора
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, WebP до 5 MB
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
