import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { uploadImage } from '@/lib/cloudinary'
import { validateImageFile } from '@/lib/file-validation'
import { checkImageUploadLimit } from '@/lib/image-limits'
import type { UploadedImage } from '@/types/image'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const limitCheck = await checkImageUploadLimit(session.user.id)
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.message || 'Достигнут лимит изображений' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const promptId = formData.get('promptId') as string | null
    const alt = formData.get('alt') as string | null

    const validationError = validateImageFile(file)
    if (validationError) {
      return NextResponse.json(
        { error: validationError.error },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file!.arrayBuffer())
    const uploadResult = await uploadImage(buffer)

    const image = await prisma.image.create({
      data: {
        url: uploadResult.url,
        secureUrl: uploadResult.secureUrl,
        publicId: uploadResult.publicId,
        format: uploadResult.format ?? null,
        bytes: uploadResult.bytes ?? null,
        width: uploadResult.width ?? null,
        height: uploadResult.height ?? null,
        folder: uploadResult.folder ?? null,
        resourceType: uploadResult.resourceType ?? null,
        alt: alt?.trim() || null,
        ownerId: session.user.id,
        promptId: promptId?.trim() || null,
      },
    })

    if (promptId?.trim()) {
      const prompt = await prisma.prompt.findFirst({
        where: { id: promptId.trim(), ownerId: session.user.id },
      })
      if (prompt) {
        await prisma.prompt.update({
          where: { id: promptId.trim() },
          data: {
            previewImageUrl: uploadResult.secureUrl,
            previewImageId: uploadResult.publicId,
          },
        })
      }
    }

    const response: UploadedImage = {
      id: image.id,
      url: image.url,
      secureUrl: image.secureUrl,
      publicId: image.publicId,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
      format: image.format ?? undefined,
      bytes: image.bytes ?? undefined,
      promptId: image.promptId,
      alt: image.alt,
      createdAt: image.createdAt.toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки изображения' },
      { status: 500 }
    )
  }
}
