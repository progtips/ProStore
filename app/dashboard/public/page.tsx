import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PublicPromptsList } from './PublicPromptsList'

/**
 * Страница публичных промтов
 */
export default async function PublicPromptsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }> | { sort?: string }
}) {
  const session = await auth()

  // Публичные промты доступны всем, но для лайков нужна авторизация
  // Не редиректим, просто запоминаем статус авторизации

  const resolvedSearchParams = await Promise.resolve(searchParams)
  const sort = resolvedSearchParams.sort || 'recent'

  // Получаем публичные промты
  const where = {
    isPublic: true,
  }

  // Определяем сортировку
  let orderBy: any
  if (sort === 'popular') {
    // Сортировка по количеству лайков (через _count)
    // В Prisma нельзя напрямую сортировать по _count, поэтому используем другой подход
    // Сначала получим все промты, затем отсортируем на клиенте или используем raw query
    // Для простоты используем сортировку по createdAt, а популярность добавим через отдельный запрос
    orderBy = { createdAt: 'desc' }
  } else {
    orderBy = { createdAt: 'desc' }
  }

  const prompts = await (prisma as any).prompt.findMany({
    where,
    orderBy,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      category: true,
      tags: true,
      _count: {
        select: {
          votes: true,
          likes: true,
        },
      },
    },
  })

  // Если сортировка по популярности, сортируем по количеству лайков
  if (sort === 'popular') {
    prompts.sort((a: any, b: any) => {
      const likesA = a._count.likes || 0
      const likesB = b._count.likes || 0
      if (likesB !== likesA) {
        return likesB - likesA
      }
      // При равном количестве лайков сортируем по дате
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  // Получаем информацию о лайках текущего пользователя (если авторизован)
  let userLikes: Set<string> = new Set()
  if (session?.user?.id) {
    const likes = await (prisma as any).like.findMany({
      where: {
        userId: session.user.id,
        promptId: {
          in: prompts.map((p: any) => p.id),
        },
      },
      select: {
        promptId: true,
      },
    })
    userLikes = new Set(likes.map((l: any) => l.promptId))
  }

  // Добавляем информацию о лайке пользователя к каждому промту
  const promptsWithLikes = prompts.map((prompt: any) => ({
    ...prompt,
    likedByMe: userLikes.has(prompt.id),
    likesCount: prompt._count.likes || 0,
  }))

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Публичные промты</h1>
      </div>

      <PublicPromptsList
        prompts={promptsWithLikes}
        currentSort={sort}
        isAuthenticated={!!session?.user?.id}
      />
    </div>
  )
}

