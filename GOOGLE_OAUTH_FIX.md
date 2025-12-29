# Исправление названия приложения в Google OAuth

## Проблема
В экране согласия Google отображается название "spin" вместо "ProStore".

## Решение

### 1. Измените название OAuth приложения в Google Cloud Console

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Перейдите в **APIs & Services** → **OAuth consent screen**
3. Выберите ваш проект
4. В разделе **App information** найдите поле **App name**
5. Измените название на **"ProStore"** (или любое другое желаемое название)
6. При необходимости заполните другие поля:
   - **User support email** - ваш email
   - **App logo** (опционально) - загрузите логотип
   - **Application home page** - URL вашего приложения
   - **Application privacy policy link** (опционально)
   - **Application terms of service link** (опционально)
7. Нажмите **Save and Continue**
8. Проверьте настройки в разделе **Scopes** (должны быть базовые scopes для Google OAuth)
9. Нажмите **Save and Continue**
10. В разделе **Test users** (если приложение в тестовом режиме) добавьте тестовые email адреса
11. Нажмите **Save and Continue**
12. Проверьте все настройки и нажмите **Back to Dashboard**

### 2. Проверьте настройки Credentials

1. Перейдите в **APIs & Services** → **Credentials**
2. Найдите ваше OAuth 2.0 Client ID
3. Убедитесь, что **Authorized redirect URIs** содержит:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (для production добавьте также ваш production URL)

### 3. Важно

- Если приложение в **Testing** режиме, только добавленные тестовые пользователи смогут войти
- Для публичного доступа нужно отправить приложение на **verification** в Google
- Изменения могут занять несколько минут для применения

### 4. После изменений

1. Очистите cookies браузера для Google
2. Попробуйте войти снова
3. Теперь должно отображаться название "ProStore" вместо "spin"

