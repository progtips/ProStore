'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

/**
 * Компонент ссылки меню с подсветкой активного состояния и иконкой
 */
export function MenuLink({ 
  href, 
  children, 
  icon 
}: { 
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700 font-semibold'
          : 'text-gray-700 hover:bg-blue-50'
      }`}
    >
      {icon && (
        <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
          {icon}
        </span>
      )}
      <span>{children}</span>
    </Link>
  )
}

