export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getTableNames } from '@/lib/db-manager'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = searchParams.get('db') || 'local'

    const tables = getTableNames()

    return NextResponse.json({ tables, dbType })
  } catch (error) {
    console.error('Ошибка получения списка таблиц:', error)
    return NextResponse.json(
      { error: 'Ошибка получения списка таблиц' },
      { status: 500 }
    )
  }
}



