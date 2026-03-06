'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { Theme } from '@/lib/theme'

const THEME_COOKIE = 'prostore-theme'

export async function setTheme(theme: Theme) {
  const cookieStore = await cookies()
  cookieStore.set(THEME_COOKIE, theme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  })
  revalidatePath('/', 'layout')
}
