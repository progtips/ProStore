/**
 * Типы для API изображений
 */

export interface UploadedImage {
  id: string
  url: string
  secureUrl: string
  publicId: string
  width?: number
  height?: number
  format?: string
  bytes?: number
  promptId?: string | null
  alt?: string | null
  createdAt: string
}

export interface ImageListResponse {
  images: UploadedImage[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
