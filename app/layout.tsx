import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProStore - Мои заметки',
  description: 'Приложение для управления заметками',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

