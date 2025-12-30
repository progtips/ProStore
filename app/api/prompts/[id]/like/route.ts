import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * POST /api/prompts/[id]/like
 * Переключает лайк для публичного промта (toggle)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Проверка авторизации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    const promptId = resolvedParams.id
    const userId = session.user.id

    // Проверка существования промта и его публичности
    const prompt = await (prisma as any).prompt.findUnique({
      where: { id: promptId },
      select: { id: true, isPublic: true },
    })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Промт не найден' },
        { status: 404 }
      )
    }

    if (!prompt.isPublic) {
      return NextResponse.json(
        { error: 'Лайкать можно только публичные промты' },
        { status: 403 }
      )
    }

    // Проверяем, есть ли уже лайк
    const existingLike = await (prisma as any).like.findUnique({
      where: {
        userId_promptId: {
          userId,
          promptId,
        },
      },
    })

    let liked: boolean
    try {
      if (existingLike) {
        // Удаляем лайк
        await (prisma as any).like.delete({
          where: {
            userId_promptId: {
              userId,
              promptId,
            },
          },
        })
        liked = false
      } else {
        // Создаём лайк
        await (prisma as any).like.create({
          data: {
            userId,
            promptId,
          },
        })
        liked = true
      }
    } catch (createError: any) {
      // Если при создании возникла ошибка уникального индекса, значит лайк уже существует
      if (createError.code === 'P2002' && !existingLike) {
        // Повторно проверяем и удаляем, если существует
        const recheck = await (prisma as any).like.findUnique({
          where: {
            userId_promptId: {
              userId,
              promptId,
            },
          },
        })
        if (recheck) {
          await (prisma as any).like.delete({
            where: {
              userId_promptId: {
                userId,
                promptId,
              },
            },
          })
          liked = false
        } else {
          throw createError
        }
      } else {
        throw createError
      }
    }

    // Подсчитываем общее количество лайков
    const likesCount = await (prisma as any).like.count({
      where: { promptId },
    })

    return NextResponse.json({
      liked,
      likesCount,
    })
  } catch (error: any) {
    console.error('Ошибка переключения лайка:', error)
    
    // Обработка ошибки уникального индекса (на случай race condition)
    if (error.code === 'P2002') {
      // Лайк уже существует или был удалён - повторяем запрос
      return NextResponse.json(
        { error: 'Попробуйте ещё раз' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Попробуйте позже' },
      { status: 500 }
    )
  }
}

