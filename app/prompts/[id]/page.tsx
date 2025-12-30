import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LikeButton } from '@/app/dashboard/prompts/LikeButton'
import { notFound } from 'next/navigation'
import { Globe, User, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CopyButton } from './CopyButton'

/**
 * Страница детального просмотра промта
 * Публичные промты доступны всем, приватные - только владельцу
 * Лайки доступны только авторизованным пользователям
 */
export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const session = await auth()
  const resolvedParams = await Promise.resolve(params)
  const promptId = resolvedParams.id

  // Получаем промт
  const prompt = await (prisma as any).prompt.findUnique({
    where: { id: promptId },
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

  if (!prompt) {
    notFound()
  }

  // Проверяем доступ: если промт приватный, только владелец может его видеть
  if (!prompt.isPublic && prompt.ownerId !== session?.user?.id) {
    notFound()
  }

  // Получаем информацию о лайке текущего пользователя (только если авторизован)
  let likedByMe = false
  if (session?.user?.id) {
    const like = await (prisma as any).like.findUnique({
      where: {
        userId_promptId: {
          userId: session.user.id,
          promptId: prompt.id,
        },
      },
    })
    likedByMe = !!like
  }

  const likesCount = prompt._count.likes || 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Кнопка назад */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад к списку</span>
          </Link>

          {/* Карточка промта */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            {/* Заголовок и иконка публичности */}
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800 flex-1 pr-4">
                {prompt.title}
              </h1>
              {prompt.isPublic && (
                <div className="p-1">
                  <Globe className="w-6 h-6 text-green-500" />
                </div>
              )}
            </div>

            {/* Описание */}
            {prompt.description && (
              <p className="text-gray-600 text-lg mb-6">{prompt.description}</p>
            )}

            {/* Содержимое */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-800 whitespace-pre-wrap">{prompt.content}</p>
            </div>

            {/* Метаданные */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{prompt.owner.name || 'Аноним'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(prompt.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
              {prompt.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
                  {prompt.category.category}
                </span>
              )}
              <CopyButton content={prompt.content} />
            </div>

            {/* Теги */}
            {prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {prompt.tags.map((tag: any) => (
                  <span
                    key={tag.name}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Кнопка лайка */}
            <div className="flex items-center justify-between pt-6 border-t">
              {session?.user?.id ? (
                <LikeButton
                  promptId={prompt.id}
                  initialLiked={likedByMe}
                  initialCount={likesCount}
                  disabled={false}
                />
              ) : (
                <div className="text-sm text-gray-500">
                  Лайков: {likesCount} • Войдите, чтобы ставить лайки
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

