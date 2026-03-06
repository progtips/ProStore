'use client'

import { useTransition } from 'react'
import { setTheme } from '@/app/actions/theme'
import type { Theme } from '@/lib/theme'

type Props = {
  currentTheme: Theme
}

export function ThemeSwitcher({ currentTheme }: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Тема оформления
      </label>
      <div className="flex gap-3">
        <label
          className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
            currentTheme === 'default'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="theme"
            value="default"
            checked={currentTheme === 'default'}
            onChange={() => {
              startTransition(() => setTheme('default'))
            }}
            className="sr-only"
            disabled={isPending}
          />
          <div className="h-10 w-10 rounded-lg bg-blue-500" />
          <div>
            <span className="font-medium text-gray-900">Стандартная</span>
            <p className="text-sm text-gray-500">Синяя тема по умолчанию</p>
          </div>
        </label>

        <label
          className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
            currentTheme === 'stitch'
              ? 'border-[#2525f4] bg-[#2525f4]/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="theme"
            value="stitch"
            checked={currentTheme === 'stitch'}
            onChange={() => {
              startTransition(() => setTheme('stitch'))
            }}
            className="sr-only"
            disabled={isPending}
          />
          <div className="h-10 w-10 rounded-lg bg-[#2525f4]" />
          <div>
            <span className="font-medium text-gray-900">Stitch</span>
            <p className="text-sm text-gray-500">Тёмная тема с акцентом #2525f4</p>
          </div>
        </label>
      </div>
      {isPending && (
        <p className="text-sm text-gray-500">Применяем тему…</p>
      )}
    </div>
  )
}
