import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { ImageListResponse, UploadedImage } from '@/types/image'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const promptId = searchParams.get('promptId')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))

    const where: { ownerId: string; promptId?: string } = {
      ownerId: session.user.id,
    }
    if (promptId?.trim()) {
      where.promptId = promptId.trim()
    }

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.image.count({ where }),
    ])

    const response: ImageListResponse = {
      images: images.map(
        (img): UploadedImage => ({
          id: img.id,
          url: img.url,
          secureUrl: img.secureUrl,
          publicId: img.publicId,
          width: img.width ?? undefined,
          height: img.height ?? undefined,
          format: img.format ?? undefined,
          bytes: img.bytes ?? undefined,
          promptId: img.promptId,
          alt: img.alt,
          createdAt: img.createdAt.toISOString(),
        })
      ),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Ошибка получения списка изображений:', error)
    return NextResponse.json(
      { error: 'Ошибка получения списка изображений' },
      { status: 500 }
    )
  }
}
