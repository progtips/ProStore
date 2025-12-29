# Решение проблемы с OAuth редиректом

## Проблема: После выбора аккаунта Google возвращает на выбор аккаунта

### Возможные причины и решения:

#### 1. Проверьте Callback URL в Google Cloud Console

**Важно:** Callback URL должен точно совпадать с вашим доменом.

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Перейдите в **APIs & Services** → **Credentials**
3. Найдите ваше OAuth 2.0 Client ID
4. Проверьте **Authorized redirect URIs**:

   **Для локальной разработки:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```

   **Для production (Vercel):**
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```

5. Убедитесь, что URL **точно совпадает** (включая протокол http/https, порт, путь)

#### 2. Проверьте переменные окружения

Убедитесь, что в `.env` есть все необходимые переменные:

```env
AUTH_SECRET="ваш-секретный-ключ"
GOOGLE_CLIENT_ID="ваш-client-id"
GOOGLE_CLIENT_SECRET="ваш-client-secret"
DATABASE_URL="postgresql://..."
```

#### 3. Проверьте базу данных

Убедитесь, что миграции применены и таблицы созданы:

```powershell
npm run db:migrate
npm run db:generate
```

Проверьте, что таблицы `users`, `accounts`, `sessions` существуют в базе данных.

#### 4. Проверьте логи сервера

Включите debug режим (уже добавлен в `auth.ts`):
- В development режиме логи будут выводиться в консоль
- Проверьте консоль сервера на наличие ошибок

#### 5. Проверьте NEXTAUTH_URL (опционально)

Если используете production, добавьте в `.env`:

```env
NEXTAUTH_URL=https://your-domain.vercel.app
```

Для локальной разработки обычно не требуется, но можно добавить:

```env
NEXTAUTH_URL=http://localhost:3000
```

#### 6. Очистите cookies браузера

Иногда проблема в старых cookies:
- Очистите cookies для `localhost` или вашего домена
- Или используйте режим инкогнито

#### 7. Проверьте, что сервер запущен на правильном порту

Убедитесь, что сервер запущен на порту 3000 (или том, который указан в callback URL).

### Быстрая проверка:

1. Откройте консоль браузера (F12)
2. Перейдите на `/login`
3. Нажмите "Войти через Google"
4. Проверьте Network tab - должен быть запрос к `/api/auth/signin/google`
5. После выбора аккаунта должен быть редирект на `/api/auth/callback/google?code=...`
6. Проверьте, что этот запрос успешен (статус 200 или 302)

### Если проблема сохраняется:

1. Проверьте логи сервера на наличие ошибок
2. Убедитесь, что база данных доступна и миграции применены
3. Проверьте, что `AUTH_SECRET` правильно установлен
4. Попробуйте пересоздать OAuth приложение в Google Cloud Console

