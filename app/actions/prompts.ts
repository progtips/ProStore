'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Создание нового промта
 */
export async function createPrompt(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  try {
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      description: formData.get('description') as string || undefined,
      isPublic: formData.get('isPublic') === 'true',
    }

    // Валидация
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: 'Заголовок обязателен' }
    }
    if (!data.content || data.content.trim().length === 0) {
      return { success: false, error: 'Содержимое обязательно' }
    }

    const prompt = await (prisma as any).prompt.create({
      data: {
        title: data.title.trim(),
        content: data.content.trim(),
        description: data.description?.trim() || null,
        isPublic: data.isPublic || false,
        ownerId: session.user.id,
        visibility: data.isPublic ? 'PUBLIC' : 'PRIVATE',
      },
    })

    revalidatePath('/dashboard/prompts')
    return { success: true, prompt }
  } catch (error: any) {
    console.error('Ошибка создания промта:', error)
    return { success: false, error: error.message || 'Ошибка создания промта' }
  }
}

/**
 * Обновление промта
 */
export async function updatePrompt(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  try {
    const id = formData.get('id') as string
    if (!id) {
      return { success: false, error: 'ID обязателен' }
    }

    // Проверяем, что промт принадлежит пользователю
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id },
    })

    if (!existingPrompt) {
      return { success: false, error: 'Промт не найден' }
    }

    if (existingPrompt.ownerId !== session.user.id) {
      return { success: false, error: 'Нет доступа к этому промту' }
    }

    const data: any = {}
    if (formData.get('title')) data.title = formData.get('title') as string
    if (formData.get('content')) data.content = formData.get('content') as string
    if (formData.has('description')) {
      data.description = formData.get('description') as string || null
    }
    if (formData.has('isPublic')) {
      data.isPublic = formData.get('isPublic') === 'true'
      data.visibility = data.isPublic ? 'PUBLIC' : 'PRIVATE'
    }

    // Валидация
    if (data.title && data.title.trim().length === 0) {
      return { success: false, error: 'Заголовок не может быть пустым' }
    }
    if (data.content && data.content.trim().length === 0) {
      return { success: false, error: 'Содержимое не может быть пустым' }
    }

    // Очищаем пустые значения
    const updateData: any = {}
    if (data.title) updateData.title = data.title.trim()
    if (data.content) updateData.content = data.content.trim()
    if (data.hasOwnProperty('description')) {
      updateData.description = data.description?.trim() || null
    }
    if (data.hasOwnProperty('isPublic')) {
      updateData.isPublic = data.isPublic
      updateData.visibility = data.isPublic ? 'PUBLIC' : 'PRIVATE'
    }

    const prompt = await (prisma as any).prompt.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/dashboard/prompts')
    return { success: true, prompt }
  } catch (error: any) {
    console.error('Ошибка обновления промта:', error)
    return { success: false, error: error.message || 'Ошибка обновления промта' }
  }
}

/**
 * Удаление промта
 */
export async function deletePrompt(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  try {
    // Проверяем, что промт принадлежит пользователю
    const prompt = await prisma.prompt.findUnique({
      where: { id },
    })

    if (!prompt) {
      return { success: false, error: 'Промт не найден' }
    }

    if (prompt.ownerId !== session.user.id) {
      return { success: false, error: 'Нет доступа к этому промту' }
    }

    await (prisma as any).prompt.delete({
      where: { id },
    })

    revalidatePath('/dashboard/prompts')
    return { success: true }
  } catch (error: any) {
    console.error('Ошибка удаления промта:', error)
    return { success: false, error: error.message || 'Ошибка удаления промта' }
  }
}

/**
 * Переключение публичности промта
 */
export async function togglePromptPublic(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id },
    })

    if (!prompt || prompt.ownerId !== session.user.id) {
      return { success: false, error: 'Нет доступа' }
    }

    const updated = await (prisma as any).prompt.update({
      where: { id },
      data: {
        isPublic: !prompt.isPublic,
        visibility: !prompt.isPublic ? 'PUBLIC' : 'PRIVATE',
      },
    })

    revalidatePath('/dashboard/prompts')
    return { success: true, prompt: updated }
  } catch (error: any) {
    console.error('Ошибка переключения публичности:', error)
    return { success: false, error: error.message || 'Ошибка обновления' }
  }
}

/**
 * Переключение избранного промта
 */
export async function togglePromptFavorite(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id },
    })

    if (!prompt || prompt.ownerId !== session.user.id) {
      return { success: false, error: 'Нет доступа' }
    }

    const updated = await (prisma as any).prompt.update({
      where: { id },
      data: {
        isFavorite: !prompt.isFavorite,
      },
    })

    revalidatePath('/dashboard/prompts')
    revalidatePath('/dashboard/favorites')
    return { success: true, prompt: updated }
  } catch (error: any) {
    console.error('Ошибка переключения избранного:', error)
    return { success: false, error: error.message || 'Ошибка обновления' }
  }
}

