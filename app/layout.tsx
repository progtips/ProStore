import type { Metadata } from 'next'
import './globals.css'
import { getTheme } from '@/lib/theme'

export const metadata: Metadata = {
  title: 'ProStore - Каталог промтов',
  description: 'Каталог лучших промтов для ваших задач',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = await getTheme()
  const themeClass = theme === 'stitch' ? 'theme-stitch dark' : ''

  return (
    <html lang="ru" className={themeClass}>
      <body className="antialiased">{children}</body>
    </html>
  )
}

