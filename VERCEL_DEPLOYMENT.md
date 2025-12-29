# Настройка для деплоя на Vercel

## Проблема: После входа через Google возвращает на логин

### 1. Проверьте Callback URL в Google Cloud Console

**КРИТИЧЕСКИ ВАЖНО:** Для production на Vercel нужно добавить правильный callback URL.

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Перейдите в **APIs & Services** → **Credentials**
3. Найдите ваше OAuth 2.0 Client ID
4. В **Authorized redirect URIs** должно быть:
   ```
   https://pro-store-theta.vercel.app/api/auth/callback/google
   ```
   (замените на ваш реальный домен Vercel)

### 2. Переменные окружения на Vercel

Убедитесь, что в настройках проекта Vercel добавлены все переменные:

1. Откройте ваш проект на [Vercel](https://vercel.com/)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте/проверьте следующие переменные:
   - `AUTH_SECRET` - ваш секретный ключ
   - `GOOGLE_CLIENT_ID` - Client ID из Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - Client Secret из Google Cloud Console
   - `DATABASE_URL` - строка подключения к базе данных
   - `NEXTAUTH_URL` (опционально) - `https://pro-store-theta.vercel.app`

### 3. Проверьте базу данных

Убедитесь, что:
- База данных доступна из Vercel (проверьте настройки NeonDB)
- Миграции применены к production базе данных
- Таблицы `users`, `accounts`, `sessions` существуют

### 4. Проверьте логи Vercel

1. Откройте ваш проект на Vercel
2. Перейдите в **Deployments** → выберите последний деплой
3. Откройте **Functions** → найдите `/api/auth/[...nextauth]`
4. Проверьте логи на наличие ошибок

### 5. Типичные проблемы

#### Проблема: Сессия не создается
- Проверьте, что `DATABASE_URL` правильный и база доступна
- Убедитесь, что миграции применены
- Проверьте логи на ошибки подключения к БД

#### Проблема: Callback URL не совпадает
- URL должен быть **точно** `https://pro-store-theta.vercel.app/api/auth/callback/google`
- Без слеша в конце
- С правильным протоколом (https)
- С правильным доменом

#### Проблема: AUTH_SECRET не установлен
- Убедитесь, что `AUTH_SECRET` добавлен в Environment Variables на Vercel
- После добавления переменных нужно **передеплоить** проект

### 6. После исправлений

1. Передеплойте проект на Vercel
2. Очистите cookies браузера
3. Попробуйте войти снова
4. Проверьте логи Vercel для отладки

