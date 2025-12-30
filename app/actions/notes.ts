'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Создает новую заметку
 */
export async function createNote(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Не авторизован' }
  }

  const title = formData.get('title') as string

  if (!title || title.trim().length === 0) {
    return { success: false, error: 'Заголовок обязателен' }
  }

  try {
    await (prisma as any).note.create({
      data: {
        title: title.trim(),
        ownerId: session.user.id,
      },
    })
    revalidatePath('/dashboard/notes')
    return { success: true }
  } catch (error: any) {
    console.error('Ошибка создания заметки:', error)
    return { success: false, error: error.message || 'Не удалось создать заметку' }
  }
}

/**
 * Удаляет заметку
 */
export async function deleteNote(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Не авторизован' }
  }

  try {
    // Проверка прав доступа
    const existingNote = await (prisma as any).note.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!existingNote || existingNote.ownerId !== session.user.id) {
      return { success: false, error: 'Нет прав для удаления этой заметки' }
    }

    await (prisma as any).note.delete({
      where: { id },
    })
    revalidatePath('/dashboard/notes')
    return { success: true }
  } catch (error: any) {
    console.error('Ошибка удаления заметки:', error)
    return { success: false, error: error.message || 'Не удалось удалить заметку' }
  }
}

