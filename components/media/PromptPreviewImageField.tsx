'use client'

import { useState } from 'react'
import { ImageUploader } from './ImageUploader'
import { getOptimizedImageUrl } from '@/lib/cloudinary-url'
import type { UploadedImage } from '@/types/image'

interface PromptPreviewImageFieldProps {
  promptId?: string
  initialImageUrl?: string | null
  initialImageId?: string | null
  onImageChange?: (image: UploadedImage | null) => void
  className?: string
}

/**
 * Поле превью-изображения промта: текущее изображение, замена, удаление
 */
export function PromptPreviewImageField({
  promptId,
  initialImageUrl,
  initialImageId,
  onImageChange,
  className = '',
}: PromptPreviewImageFieldProps) {
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null)
  const [removed, setRemoved] = useState(false)

  const hasImage = currentImage || (initialImageUrl && !removed)

  const handleUploaded = (image: UploadedImage) => {
    setCurrentImage(image)
    setRemoved(false)
    onImageChange?.(image)
  }

  const handleRemove = () => {
    setCurrentImage(null)
    setRemoved(true)
    onImageChange?.(null)
  }

  const handleReplace = () => {
    setCurrentImage(null)
    setRemoved(true)
    onImageChange?.(null)
  }

  const displayUrl = currentImage
    ? getOptimizedImageUrl(currentImage.secureUrl, 'card')
    : initialImageUrl

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
        Превью-изображение
      </label>

      {!hasImage ? (
        <ImageUploader
          promptId={promptId}
          onUploaded={handleUploaded}
        />
      ) : (
        <div className="space-y-2">
          <div className="relative inline-block">
            {displayUrl && (
              <img
                src={displayUrl}
                alt="Превью промта"
                className="max-h-48 rounded-lg border border-gray-200 object-cover"
              />
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={handleReplace}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Заменить
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Нажмите «Заменить» для загрузки другого изображения
          </p>
        </div>
      )}
    </div>
  )
}
