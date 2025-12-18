# ProStore

Минимальный проект Next.js (App Router) + Prisma + NeonDB (PostgreSQL), готовый к деплою на Vercel.

## Технологии

- **Next.js 14** с App Router и TypeScript
- **Prisma** как ORM
- **NeonDB** (PostgreSQL) как база данных
- **Tailwind CSS** для стилей

## Быстрый старт

### 1. Установка зависимостей

```powershell
npm install
```

### 2. Настройка базы данных

1. Создайте проект на [Neon.tech](https://neon.tech)
2. Скопируйте Connection String в файл `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   ```

**Важно для миграций**: Для выполнения миграций Prisma может потребоваться прямой connection string (не pooler). В Neon Dashboard есть два варианта:
- **Connection pooling** - для приложения (можно использовать в production)
- **Direct connection** - для миграций (используйте этот для `prisma migrate`)

### 3. Инициализация базы данных

```powershell
# Генерация Prisma Client
npm run db:generate

# Создание миграции (используйте прямой connection string)
npm run db:migrate
# При запросе имени миграции введите: init

# Заполнение базы данных тестовыми данными
npm run db:seed
```

Если миграции не работают с pooler connection string, используйте прямой connection string из Neon Dashboard.

### 4. Запуск проекта

```powershell
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Структура проекта

```
ProStore/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Корневой layout
│   ├── page.tsx      # Главная страница
│   └── globals.css   # Глобальные стили
├── lib/
│   └── prisma.ts     # Singleton Prisma Client
├── prisma/
│   ├── schema.prisma # Схема базы данных
│   └── seed.ts       # Seed скрипт
└── .env              # Переменные окружения
```

## Модель данных

### Note

- `id` (String, UUID) - уникальный идентификатор
- `title` (String) - заголовок заметки
- `createdAt` (DateTime) - дата создания

## Деплой на Vercel

1. Подключите репозиторий к Vercel
2. В настройках проекта добавьте переменную окружения:
   - `DATABASE_URL` - ваш connection string от Neon
3. **ВАЖНО**: После деплоя необходимо создать таблицу в базе данных:
   
   **Вариант 1: Через Neon Dashboard (рекомендуется)**
   1. Откройте Neon Dashboard → ваш проект → SQL Editor
   2. Выполните SQL из файла `prisma/migrations/init.sql`:
   ```sql
   CREATE TABLE IF NOT EXISTS "notes" (
       "id" TEXT NOT NULL,
       "title" TEXT NOT NULL,
       "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
   );
   ```
   
   **Вариант 2: Через Prisma Migrate (локально)**
   1. Используйте прямой connection string (не pooler) в `.env`
   2. Выполните: `npm run db:migrate`
   3. При запросе имени миграции введите: `init`
4. Vercel автоматически выполнит `npm run build`, который включает `prisma generate`

## Полезные команды

```powershell
npm run dev          # Запуск dev сервера
npm run build        # Сборка для production
npm run start        # Запуск production сервера
npm run db:migrate   # Создание и применение миграций
npm run db:generate  # Генерация Prisma Client
npm run db:seed      # Заполнение базы данных
npm run db:studio    # Открыть Prisma Studio
```

## Решение проблем

### Ошибка подключения к базе данных

Если видите ошибку `Can't reach database server`:
1. Убедитесь, что база данных активна в Neon Dashboard (Neon приостанавливает неактивные базы)
2. Для миграций используйте прямой connection string вместо pooler
3. Проверьте правильность DATABASE_URL в `.env`
