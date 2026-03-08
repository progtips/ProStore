/**
 * Построение Cloudinary URL с трансформациями (клиент-безопасно).
 * Использует secureUrl из API, вставляет трансформации в путь.
 */

const PRESETS = {
  thumbnail: 'f_auto,q_auto,c_fill,w_200,h_140',
  card: 'f_auto,q_auto,c_fill,w_400,h_280',
  large: 'f_auto,q_auto,w_1200',
} as const

/**
 * Добавить preset-трансформации к Cloudinary URL
 */
export function getOptimizedImageUrl(
  secureUrl: string,
  preset: keyof typeof PRESETS
): string {
  const transform = PRESETS[preset]
  const marker = '/image/upload/'
  const idx = secureUrl.indexOf(marker)
  if (idx === -1) return secureUrl
  const insertAt = idx + marker.length
  return secureUrl.slice(0, insertAt) + transform + '/' + secureUrl.slice(insertAt)
}
