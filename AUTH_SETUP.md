# Настройка аутентификации ProStore

## Установленные компоненты

✅ Auth.js (NextAuth) с поддержкой Google OAuth
✅ Database sessions для стабильного userId
✅ Middleware для защиты страниц
✅ Автоматическое создание пользователей при первом входе

## Настройка переменных окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Auth.js - сгенерируйте секретный ключ:
# openssl rand -base64 32
AUTH_SECRET="your-secret-key-here"

# Google OAuth
# Получите на https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Настройка OAuth провайдеров

### Google OAuth

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Перейдите в "Credentials" → "Create Credentials" → "OAuth client ID"
5. Выберите "Web application"
6. Добавьте Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (для разработки)
   - `https://yourdomain.com/api/auth/callback/google` (для production)
7. Скопируйте Client ID и Client Secret в `.env`

## Генерация AUTH_SECRET

Выполните в PowerShell:

```powershell
# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Или используйте OpenSSL (если установлен)
openssl rand -base64 32
```

## Структура базы данных

Auth.js автоматически создаст следующие таблицы:
- `users` - пользователи
- `accounts` - OAuth аккаунты
- `sessions` - сессии пользователей
- `verification_tokens` - токены верификации

## Защищенные маршруты

Следующие страницы защищены middleware и требуют авторизации:
- `/dashboard` - личный кабинет
- `/my-prompts` - мои промты

Неавторизованные пользователи автоматически перенаправляются на `/login`.

## Использование в коде

### Получение сессии на сервере

```typescript
import { auth } from '@/auth'

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  
  // session.user.id - стабильный userId
  // session.user.email - email пользователя
  // session.user.name - имя пользователя
  // session.user.image - аватар пользователя
}
```

### Выход из системы

```typescript
import { signOut } from '@/auth'

// Server Action
async function handleSignOut() {
  await signOut({ redirectTo: '/' })
}
```

### Вход через OAuth (клиент)

```typescript
'use client'
import { signIn } from 'next-auth/react'

function LoginButton() {
  return (
    <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
      Войти через Google
    </button>
  )
}
```

## Миграции

После настройки переменных окружения выполните:

```powershell
npm run db:migrate
npm run db:generate
```

## Проверка работы

1. Запустите сервер: `npm run dev`
2. Откройте `http://localhost:3000`
3. Нажмите "Войти" → выберите провайдера
4. После входа вы будете перенаправлены в `/dashboard`

## Решение проблем

### Ошибка "Invalid credentials"
- Проверьте правильность Client ID и Client Secret
- Убедитесь, что Callback URI совпадает с настройками в OAuth провайдере

### Ошибка "AUTH_SECRET is missing"
- Убедитесь, что переменная `AUTH_SECRET` установлена в `.env`
- Перезапустите сервер после изменения `.env`

### Пользователь не создается в БД
- Проверьте подключение к базе данных
- Убедитесь, что миграции применены: `npm run db:migrate`

