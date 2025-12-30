import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HomePromptCard } from '@/components/prompts/HomePromptCard'
import Link from 'next/link'
import { Plus } from 'lucide-react'

/**
 * Главная страница ProStore
 * Два раздела: "Новые" и "Популярные" публичные промты
 * Гости могут только просматривать, лайки доступны только авторизованным
 */
export default async function HomePage() {
  const session = await auth()

  // Получаем новые публичные промты (последние 20)
  const recentPrompts = await (prisma as any).prompt.findMany({
    where: {
      isPublic: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
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

  // Получаем все публичные промты для сортировки по популярности
  const allPublicPrompts = await (prisma as any).prompt.findMany({
    where: {
      isPublic: true,
    },
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

  // Сортируем по количеству лайков
  const popularPrompts = allPublicPrompts
    .sort((a: any, b: any) => {
      const likesA = a._count.likes || 0
      const likesB = b._count.likes || 0
      if (likesB !== likesA) {
        return likesB - likesA
      }
      // При равном количестве лайков сортируем по дате
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .slice(0, 20)

  // Получаем информацию о лайках текущего пользователя (только если авторизован)
  let userLikes: Set<string> = new Set()
  if (session?.user?.id) {
    const allPromptIds = [
      ...recentPrompts.map((p: any) => p.id),
      ...popularPrompts.map((p: any) => p.id),
    ]
    const uniquePromptIds = Array.from(new Set(allPromptIds))

    if (uniquePromptIds.length > 0) {
      const likes = await (prisma as any).like.findMany({
        where: {
          userId: session.user.id,
          promptId: {
            in: uniquePromptIds,
          },
        },
        select: {
          promptId: true,
        },
      })
      userLikes = new Set(likes.map((l: any) => l.promptId))
    }
  }

  // Добавляем информацию о лайке пользователя к каждому промту
  const enrichPrompt = (prompt: any) => ({
    ...prompt,
    likedByMe: userLikes.has(prompt.id),
    likesCount: prompt._count.likes || 0,
  })

  const recentPromptsWithLikes = recentPrompts.map(enrichPrompt)
  const popularPromptsWithLikes = popularPrompts.map(enrichPrompt)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero-блок */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ProStore
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Каталог лучших промтов для ваших задач
              </p>
              {session?.user ? (
                <Link
                  href="/dashboard/prompts"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Добавить промт
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Link
                    href="/login?callbackUrl=/dashboard/prompts"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Добавить промт
                  </Link>
                  <p className="text-sm text-blue-100">Войдите, чтобы добавлять промты</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Секция "Новые" */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Новые</h2>
            {recentPromptsWithLikes.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600">Публичных промтов пока нет</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentPromptsWithLikes.map((prompt: any) => (
                  <HomePromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isAuthenticated={!!session?.user?.id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Секция "Популярные" */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Популярные</h2>
            {popularPromptsWithLikes.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600">Популярных промтов пока нет</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularPromptsWithLikes.map((prompt: any) => (
                  <HomePromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isAuthenticated={!!session?.user?.id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
