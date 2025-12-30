import Link from 'next/link'

/**
 * Footer компонент с копирайтом и ссылками
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm">
            © {currentYear} ProStore. Все права защищены.
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/policy"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Политика
            </Link>
            <Link
              href="/contacts"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Контакты
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

