export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient, getModelName } from '@/lib/db-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> | { table: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as 'local' | 'production'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const resolvedParams = await Promise.resolve(params)
    const prisma = getPrismaClient(dbType)
    const modelName = getModelName(resolvedParams.table)

    // Проверяем наличие модели в Prisma Client
    const model = (prisma as any)[modelName]
    if (!model) {
      return NextResponse.json(
        { error: `Модель ${modelName} не найдена` },
        { status: 404 }
      )
    }

    // Получаем общее количество записей
    const total = await model.count()

    // Получаем данные с пагинацией
    const skip = (page - 1) * pageSize
    
    // Пытаемся отсортировать по createdAt, если поле существует, иначе по id
    let orderBy: any = { id: 'desc' }
    try {
      const firstRecord = await model.findFirst()
      if (firstRecord) {
        if ('createdAt' in firstRecord) {
          orderBy = { createdAt: 'desc' }
        } else if ('id' in firstRecord) {
          orderBy = { id: 'desc' }
        }
      }
    } catch {
      // Используем id по умолчанию
      orderBy = { id: 'desc' }
    }
    
    const data = await model.findMany({
      skip,
      take: pageSize,
      orderBy,
    })

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Ошибка получения данных таблицы:', error)
    return NextResponse.json(
      { error: 'Ошибка получения данных таблицы' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> | { table: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as 'local' | 'production'
    const body = await request.json()

    const resolvedParams = await Promise.resolve(params)
    const prisma = getPrismaClient(dbType)
    const modelName = getModelName(resolvedParams.table)

    // Проверяем наличие модели в Prisma Client
    const model = (prisma as any)[modelName]
    if (!model) {
      return NextResponse.json(
        { error: `Модель ${modelName} не найдена` },
        { status: 404 }
      )
    }
    const result = await model.create({ data: body })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error('Ошибка создания записи:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка создания записи' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> | { table: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as 'local' | 'production'
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID обязателен для обновления' },
        { status: 400 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    const prisma = getPrismaClient(dbType)
    const modelName = getModelName(resolvedParams.table)

    // Проверяем наличие модели в Prisma Client
    const model = (prisma as any)[modelName]
    if (!model) {
      return NextResponse.json(
        { error: `Модель ${modelName} не найдена` },
        { status: 404 }
      )
    }
    const result = await model.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error('Ошибка обновления записи:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка обновления записи' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> | { table: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as 'local' | 'production'
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID обязателен для удаления' },
        { status: 400 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    const prisma = getPrismaClient(dbType)
    const modelName = getModelName(resolvedParams.table)

    // Проверяем наличие модели в Prisma Client
    const model = (prisma as any)[modelName]
    if (!model) {
      return NextResponse.json(
        { error: `Модель ${modelName} не найдена` },
        { status: 404 }
      )
    }
    await model.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Ошибка удаления записи:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка удаления записи' },
      { status: 500 }
    )
  }
}

