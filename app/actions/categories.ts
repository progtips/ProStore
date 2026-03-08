'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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

/**
 * Проверка прав администратора
 */
async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Требуется авторизация' }
  }
  if (session.user.role !== 'admin') {
    return { error: 'Редактирование категорий разрешено только администраторам' }
  }
  return null
}

/**
 * Создание категории (только для администраторов)
 */
export async function createCategory(formData: FormData) {
  const err = await requireAdmin()
  if (err) return { success: false, error: err.error }

  const category = (formData.get('category') as string)?.trim()
  if (!category) {
    return { success: false, error: 'Название категории обязательно' }
  }

  try {
    await prisma.category.create({
      data: { category },
    })
    revalidatePath('/dashboard/categories')
    revalidatePath('/dashboard/prompts')
    revalidatePath('/dashboard/favorites')
    return { success: true }
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return { success: false, error: 'Категория с таким названием уже существует' }
    }
    return { success: false, error: e?.message || 'Ошибка создания категории' }
  }
}

/**
 * Обновление категории (только для администраторов)
 */
export async function updateCategory(id: string, category: string) {
  const err = await requireAdmin()
  if (err) return { success: false, error: err.error }

  const trimmed = category?.trim()
  if (!trimmed) {
    return { success: false, error: 'Название категории обязательно' }
  }

  try {
    await prisma.category.update({
      where: { id },
      data: { category: trimmed },
    })
    revalidatePath('/dashboard/categories')
    revalidatePath('/dashboard/prompts')
    revalidatePath('/dashboard/favorites')
    return { success: true }
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return { success: false, error: 'Категория с таким названием уже существует' }
    }
    return { success: false, error: e?.message || 'Ошибка обновления категории' }
  }
}

/**
 * Удаление категории (только для администраторов)
 */
export async function deleteCategory(id: string) {
  const err = await requireAdmin()
  if (err) return { success: false, error: err.error }

  try {
    await prisma.category.delete({
      where: { id },
    })
    revalidatePath('/dashboard/categories')
    revalidatePath('/dashboard/prompts')
    revalidatePath('/dashboard/favorites')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Ошибка удаления категории' }
  }
}
