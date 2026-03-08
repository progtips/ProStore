import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { deleteImage } from '@/lib/cloudinary'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const { id } = await Promise.resolve(params)
    if (!id) {
      return NextResponse.json({ error: 'ID изображения обязателен' }, { status: 400 })
    }

    const image = await prisma.image.findUnique({
      where: { id },
    })

    if (!image) {
      return NextResponse.json({ error: 'Изображение не найдено' }, { status: 404 })
    }

    if (image.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Нет доступа к этому изображению' },
        { status: 403 }
      )
    }

    await deleteImage(image.publicId)

    if (image.promptId) {
      const prompt = await prisma.prompt.findFirst({
        where: {
          id: image.promptId,
          previewImageId: image.publicId,
        },
      })
      if (prompt) {
        await prisma.prompt.update({
          where: { id: image.promptId },
          data: {
            previewImageUrl: null,
            previewImageId: null,
          },
        })
      }
    }

    await prisma.image.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка удаления изображения:', error)
    return NextResponse.json(
      { error: 'Ошибка удаления изображения' },
      { status: 500 }
    )
  }
}
