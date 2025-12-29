import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PromptsList } from './PromptsList'
import { CreatePromptDialog } from './CreatePromptDialog'

/**
 * Страница управления промтами
 */
export default async function PromptsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard/prompts')
  }

  // Получаем промты текущего пользователя
  const prompts = await (prisma as any).prompt.findMany({
    where: {
      ownerId: session.user.id,
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Мои промты</h1>
        <CreatePromptDialog />
      </div>

      <PromptsList prompts={prompts} />
    </div>
  )
}

