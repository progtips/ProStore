/**
 * Валидация загружаемых изображений
 */

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export interface ValidationError {
  error: string
  code: 'INVALID_TYPE' | 'INVALID_EXTENSION' | 'FILE_TOO_LARGE' | 'NO_FILE'
}

/**
 * Проверка MIME-типа
 */
function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number])
}

/**
 * Проверка расширения файла
 */
function isAllowedExtension(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.') || 0)
  return ALLOWED_EXTENSIONS.includes(ext)
}

/**
 * Валидация загружаемого изображения
 * @returns null если валидно, иначе объект с ошибкой
 */
export function validateImageFile(
  file: File | null | undefined
): ValidationError | null {
  if (!file || !(file instanceof File)) {
    return { error: 'Файл не предоставлен', code: 'NO_FILE' }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      error: `Размер файла превышает 5 MB (текущий: ${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      code: 'FILE_TOO_LARGE',
    }
  }

  if (!isAllowedMimeType(file.type)) {
    return {
      error: `Недопустимый тип файла: ${file.type}. Разрешены: JPEG, PNG, WebP`,
      code: 'INVALID_TYPE',
    }
  }

  if (!isAllowedExtension(file.name)) {
    return {
      error: `Недопустимое расширение файла. Разрешены: .jpg, .jpeg, .png, .webp`,
      code: 'INVALID_EXTENSION',
    }
  }

  return null
}
