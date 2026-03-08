/**
 * Проверка лимитов загрузки изображений по плану пользователя.
 * TODO: Интеграция с SaaS-планами (free: 20, pro: 500 и т.д.)
 * TODO: Rate limiting для upload
 * TODO: Virus scanning (при необходимости)
 * TODO: Moderation hook для будущей модерации
 */

import { prisma } from '@/lib/prisma'

export interface ImageLimitResult {
  allowed: boolean
  current?: number
  limit?: number
  message?: string
}

/**
 * Проверка лимита загрузки изображений для пользователя
 * Пока возвращает allowed: true. Структура готова для расширения.
 */
export async function checkImageUploadLimit(
  userId: string
): Promise<ImageLimitResult> {
  // TODO: Получить план пользователя (free/pro) и соответствующий лимит
  // const plan = await getUserPlan(userId)
  // const limit = plan === 'pro' ? 500 : 20

  const current = await prisma.image.count({
    where: { ownerId: userId },
  })

  // Пока без лимита
  const limit = 1000 // Временное значение для разработки
  const allowed = current < limit

  return {
    allowed: true, // Пока всегда разрешаем
    current,
    limit,
    ...(allowed ? {} : { message: `Достигнут лимит изображений (${limit})` }),
  }
}
