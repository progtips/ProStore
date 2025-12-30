import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProStore - Каталог промтов',
  description: 'Каталог лучших промтов для ваших задач',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  )
}

