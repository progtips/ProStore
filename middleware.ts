import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Миiddleware без проверки авторизации
 * Защита страниц реализована в server components через auth() и redirect()
 */
export async function middleware(request: NextRequest) {
  // Middleware только для технических задач (например, заголовки, редиректы)
  // НЕ используем auth() здесь - это Edge runtime, нет доступа к Prisma
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}

