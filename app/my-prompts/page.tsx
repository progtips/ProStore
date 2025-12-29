import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { signOut } from '@/auth'

export default async function MyPromptsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Получаем промты текущего пользователя
  // Используем явное приведение типа для совместимости с Vercel build
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-xl font-bold text-gray-800">
                ProStore
              </Link>
              <Link
                href="/my-prompts"
                className="text-blue-600 font-semibold"
              >
                Мои промты
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-gray-700">{session.user.name || session.user.email}</span>
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/' })
                }}
              >
                <button
                  type="submit"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Выйти
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Мои промты</h1>
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Назад в кабинет
          </Link>
        </div>

        {prompts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">У вас пока нет промтов</p>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Создать первый промт
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {prompts.map((prompt: any) => (
              <div
                key={prompt.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">{prompt.title}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prompt.visibility === 'PUBLIC'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {prompt.visibility === 'PUBLIC' ? 'Публичный' : 'Приватный'}
                  </span>
                </div>
                
                {prompt.description && (
                  <p className="text-gray-600 mb-3">{prompt.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {prompt.category && (
                    <span>Категория: {prompt.category.category}</span>
                  )}
                  <span>Голосов: {prompt._count.votes}</span>
                  <span>
                    Обновлено: {new Date(prompt.updatedAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>

                {prompt.tags.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {prompt.tags.map((tag: any) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

