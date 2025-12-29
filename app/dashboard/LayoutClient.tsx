'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

/**
 * Клиентский компонент для подсветки активного пункта меню
 */
export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return <>{children}</>
}

/**
 * Компонент ссылки меню с подсветкой активного состояния
 */
export function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700 font-semibold'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  )
}

