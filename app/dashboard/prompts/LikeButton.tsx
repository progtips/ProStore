'use client'

import { useState, useEffect, useRef } from 'react'
import { ThumbsUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  promptId: string
  initialLiked: boolean
  initialCount: number
  disabled?: boolean
}

/**
 * Кнопка лайка с оптимистичным обновлением
 */
export function LikeButton({
  promptId,
  initialLiked,
  initialCount,
  disabled = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const prevPromptIdRef = useRef(promptId)
  const isInitialMount = useRef(true)

  // Синхронизируем состояние с пропсами только при смене промта
  useEffect(() => {
    if (prevPromptIdRef.current !== promptId) {
      prevPromptIdRef.current = promptId
      setLiked(initialLiked)
      setCount(initialCount)
    }
  }, [promptId]) // Только при смене promptId, не при изменении пропсов

  const handleLike = async () => {
    if (isLoading || disabled) return

    // Оптимистичное обновление
    const previousLiked = liked
    const previousCount = count
    const newLiked = !liked
    const newCount = newLiked ? count + 1 : Math.max(0, count - 1)

    setLiked(newLiked)
    setCount(newCount)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/prompts/${promptId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Откатываем оптимистичное обновление при ошибке
        setLiked(previousLiked)
        setCount(previousCount)

        if (response.status === 401) {
          alert('Необходима авторизация. Пожалуйста, войдите в систему.')
          router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname))
          return
        }

        const error = await response.json()
        alert(error.error || 'Ошибка при установке лайка')
        return
      }

      const data = await response.json()
      // Обновляем состояние на основе ответа сервера
      // Это гарантирует, что счетчик всегда соответствует данным на сервере
      setLiked(data.liked)
      setCount(data.likesCount)
    } catch (error) {
      // Откатываем оптимистичное обновление при ошибке
      setLiked(previousLiked)
      setCount(previousCount)
      console.error('Ошибка при установке лайка:', error)
      alert('Попробуйте позже')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading || disabled}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
        liked
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={liked ? 'Убрать лайк' : 'Поставить лайк'}
    >
      <ThumbsUp
        className={`w-5 h-5 ${count > 0 ? 'text-yellow-500' : ''} ${liked ? 'fill-current' : ''}`}
        strokeWidth={2}
      />
      <span className="text-sm font-medium">{count}</span>
    </button>
  )
}

