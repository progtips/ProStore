/**
 * Cloudinary — серверная конфигурация и утилиты для загрузки/удаления изображений.
 * Используется только на сервере (API routes, server actions).
 */

import { v2 as cloudinary } from 'cloudinary'

// Конфигурация из переменных окружения
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/** Папка по умолчанию для загрузок ProStore */
const DEFAULT_FOLDER = 'prostore/prompts'

/** Результат загрузки изображения */
export interface CloudinaryUploadResult {
  publicId: string
  secureUrl: string
  url: string
  width?: number
  height?: number
  format?: string
  bytes?: number
  folder?: string
  resourceType?: string
}

/** Опции загрузки */
export interface UploadImageOptions {
  folder?: string
  subfolder?: string
  publicId?: string
}

/**
 * Загрузка изображения из буфера в Cloudinary
 */
export async function uploadImage(
  buffer: Buffer,
  options: UploadImageOptions = {}
): Promise<CloudinaryUploadResult> {
  const folder = options.subfolder
    ? `${DEFAULT_FOLDER}/${options.subfolder}`
    : options.folder ?? DEFAULT_FOLDER

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        public_id: options.publicId,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }
        if (!result) {
          reject(new Error('Upload failed: no result'))
          return
        }
        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          url: result.url ?? result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          folder: result.folder,
          resourceType: result.resource_type,
        })
      }
    )
    uploadStream.end(buffer)
  })
}

/**
 * Удаление изображения из Cloudinary по publicId
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}

/** Опции для построения URL с трансформациями */
export interface CloudinaryUrlOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop' | 'limit' | 'pad'
  quality?: 'auto' | number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
}

/**
 * Построение URL изображения с трансформациями для оптимизированной доставки
 * Пример: f_auto,q_auto,w_600
 */
export function buildCloudinaryImageUrl(
  publicId: string,
  options: CloudinaryUrlOptions = {}
): string {
  const transformations: string[] = []

  if (options.format === 'auto' || !options.format) {
    transformations.push('f_auto')
  } else if (options.format) {
    transformations.push(`f_${options.format}`)
  }

  if (options.quality === 'auto' || !options.quality) {
    transformations.push('q_auto')
  } else if (typeof options.quality === 'number') {
    transformations.push(`q_${options.quality}`)
  }

  if (options.crop) {
    transformations.push(`c_${options.crop}`)
  }
  if (options.width) {
    transformations.push(`w_${options.width}`)
  }
  if (options.height) {
    transformations.push(`h_${options.height}`)
  }

  const transformationStr = transformations.join(',')
  return cloudinary.url(publicId, {
    secure: true,
    transformation: transformationStr
      ? [{ raw_transformation: transformationStr }]
      : undefined,
  })
}

/** Presets для разных размеров отображения */
export const IMAGE_PRESETS = {
  thumbnail: { width: 200, height: 140, crop: 'fill' as const },
  card: { width: 400, height: 280, crop: 'fill' as const },
  large: { width: 1200, crop: 'scale' as const },
} as const

/**
 * Получение оптимизированного URL по preset
 */
export function getOptimizedImageUrl(
  publicId: string,
  preset: keyof typeof IMAGE_PRESETS
): string {
  const opts = IMAGE_PRESETS[preset]
  return buildCloudinaryImageUrl(publicId, {
    ...opts,
    quality: 'auto',
    format: 'auto',
  })
}
