import { PrismaClient } from '@prisma/client'

export type DbType = 'local' | 'production'

// Создаём экземпляры Prisma для разных БД
const prismaInstances: Record<DbType, PrismaClient | null> = {
  local: null,
  production: null,
}

export function getPrismaClient(dbType: DbType): PrismaClient {
  if (!prismaInstances[dbType]) {
    const databaseUrl = dbType === 'local' 
      ? process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL
      : process.env.DATABASE_URL_PRODUCTION || process.env.DATABASE_URL

    prismaInstances[dbType] = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  }

  return prismaInstances[dbType]!
}

// Получаем список всех моделей из Prisma
export function getTableNames(): string[] {
  return [
    'users',
    'notes',
    'categories',
    'prompts',
    'tags',
    'votes',
  ]
}

// Получаем имя модели по имени таблицы
export function getModelName(tableName: string): string {
  const modelMap: Record<string, string> = {
    'users': 'user',
    'notes': 'note',
    'categories': 'category',
    'prompts': 'prompt',
    'tags': 'tag',
    'votes': 'vote',
  }
  return modelMap[tableName] || tableName
}

