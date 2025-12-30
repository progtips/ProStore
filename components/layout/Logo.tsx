import Link from 'next/link'

/**
 * Логотип ProStore
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group-hover:scale-105 transition-transform"
      >
        {/* Фон - градиент */}
        <rect width="32" height="32" rx="6" fill="url(#gradient)" />
        
        {/* Иконка - стилизованная буква P */}
        <path
          d="M10 8 L10 24 M10 8 L18 8 C20 8 22 10 22 12 C22 14 20 16 18 16 L10 16"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Декоративный элемент - точка */}
        <circle cx="24" cy="20" r="2" fill="white" />
        
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
        ProStore
      </span>
    </Link>
  )
}

