import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PromptsList } from '../prompts/PromptsList'

/**
 * Страница избранных промтов
 */
export default async function FavoritesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard/favorites')
  }

  // Получаем избранные промты текущего пользователя
  const prompts = await (prisma as any).prompt.findMany({
    where: {
      ownerId: session.user.id,
      isFavorite: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      category: true,
      tags: true,
      _count: {
        select: {
          votes: true,
        },
      },
    },
  })

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Избранное</h1>
      <PromptsList prompts={prompts} />
    </div>
  )
}

