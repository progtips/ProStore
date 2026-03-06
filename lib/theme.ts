import { cookies } from 'next/headers'

export type Theme = 'default' | 'stitch'

const THEME_COOKIE = 'prostore-theme'

export async function getTheme(): Promise<Theme> {
  const cookieStore = await cookies()
  const theme = cookieStore.get(THEME_COOKIE)?.value
  if (theme === 'stitch' || theme === 'default') {
    return theme
  }
  return 'default'
}
