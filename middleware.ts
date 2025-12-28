import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем API routes и статические файлы
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  try {
    const session = await auth()

    // Защищенные маршруты
    const protectedRoutes = ['/dashboard', '/my-prompts']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Если пользователь не авторизован и пытается зайти на защищенную страницу
    if (isProtectedRoute && !session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  } catch (error) {
    // В случае ошибки просто пропускаем запрос
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
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

