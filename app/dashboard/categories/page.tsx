import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CategoriesTable } from './CategoriesTable'

/**
 * Страница управления категориями (только для администраторов)
 */
export default async function CategoriesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard/categories')
  }

  if (session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  const categories = await prisma.category.findMany({
    orderBy: { category: 'asc' },
  })

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Категории</h1>
      <p className="text-gray-600 mb-6">
        Управление категориями для промтов. Только администраторы могут добавлять, изменять и удалять категории.
      </p>
      <CategoriesTable categories={categories} />
    </div>
  )
}
