'use server'

import { prisma } from '@/lib/prisma'

/**
 * Получение списка категорий для селекта
 */
export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { category: 'asc' },
    select: { id: true, category: true },
  })
  return categories
}
