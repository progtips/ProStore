# План: Media Management System для ProStore

Система управления превью-изображениями промтов с Cloudinary.

---

## Адаптация к текущему ProStore

| Спецификация | ProStore | Решение |
|---------------|----------|---------|
| `userId` | `ownerId` в Prompt | Использовать `ownerId` в Image, `auth().user.id` |
| `getCurrentUser()` | `auth()` из NextAuth | Использовать `auth()` |
| Next.js 15+ | Next.js 14 | Работать с 14, совместимо |
| Упрощённый Prompt | Полная модель Prompt | Добавить поля, не менять существующие |

---

## 1. Установка и настройка

### 1.1. Пакеты

```powershell
npm install cloudinary
```

Опционально для улучшенной типизации:
```powershell
npm install -D @types/multer
```

### 1.2. Переменные окружения (.env)

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 1.3. Файл конфигурации

- **Путь:** `lib/cloudinary.ts`
- Изолированная серверная конфигурация Cloudinary

---

## 2. Схема базы данных

### 2.1. Изменения в Prisma

**Добавить в модель User:**
```prisma
images Image[]
```

**Добавить в модель Prompt:**
```prisma
previewImageUrl  String?
previewImageId   String?
images          Image[]
```

**Новая модель Image:**
```prisma
model Image {
  id           String   @id @default(cuid())
  url          String
  secureUrl    String
  publicId     String   @unique
  format       String?
  bytes        Int?
  width        Int?
  height       Int?
  folder       String?
  resourceType String?
  alt          String?
  ownerId      String
  promptId     String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  owner  User    @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  prompt Prompt? @relation(fields: [promptId], references: [id], onDelete: SetNull)

  @@index([ownerId])
  @@index([promptId])
  @@index([createdAt])
  @@map("images")
}
```

**Добавить в User:**
```prisma
images Image[]
```

**Примечание:** Используем `ownerId` вместо `userId` для согласованности с Prompt.

### 2.2. Миграция

```powershell
npx prisma migrate dev --name add_images_and_preview
```

---

## 3. Структура файлов

```
lib/
  cloudinary.ts          # Конфиг, upload, delete, buildUrl
  file-validation.ts     # Валидация MIME, размера, расширения
  image-limits.ts        # checkImageUploadLimit (stub для SaaS)

app/api/images/
  upload/
    route.ts             # POST multipart/form-data
  route.ts               # GET с query params
  [id]/
    route.ts             # DELETE

components/media/
  ImageUploader.tsx      # Drag-drop, preview, validation
  ImageGallery.tsx       # Сетка, пагинация, удаление
  PromptPreviewImageField.tsx  # Обёртка для промта

types/
  image.ts               # UploadedImage, API responses
```

---

## 4. Порядок реализации

### Фаза 1: Инфраструктура (1–2 ч)

| # | Задача | Файл | Описание |
|---|--------|------|----------|
| 1.1 | Cloudinary config | `lib/cloudinary.ts` | uploadImage, deleteImage, buildCloudinaryImageUrl |
| 1.2 | Валидация файлов | `lib/file-validation.ts` | MIME (jpeg, png, webp), размер ≤5MB, расширение |
| 1.3 | Лимиты (stub) | `lib/image-limits.ts` | checkImageUploadLimit(userId) → { allowed: true } |
| 1.4 | Типы | `types/image.ts` | UploadedImage, ImageListResponse |

### Фаза 2: Схема и миграция (0.5 ч)

| # | Задача | Описание |
|---|--------|----------|
| 2.1 | Обновить schema.prisma | Добавить Image, поля в Prompt, relation в User |
| 2.2 | Миграция | `prisma migrate dev --name add_images_and_preview` |

### Фаза 3: API (2–3 ч)

| # | Задача | Маршрут | Описание |
|---|--------|--------|----------|
| 3.1 | Upload | POST /api/images/upload | multipart: file, promptId?, alt? |
| 3.2 | List | GET /api/images | query: promptId?, page?, limit? |
| 3.3 | Delete | DELETE /api/images/[id] | Проверка владельца, очистка Prompt.previewImageUrl |

Коды ответов: 400, 401, 403, 404, 500.

### Фаза 4: UI-компоненты (2–3 ч)

| # | Компонент | Назначение |
|---|-----------|------------|
| 4.1 | ImageUploader | Drag-drop, preview, loading, onUploaded |
| 4.2 | ImageGallery | Сетка, пагинация, удаление, empty state |
| 4.3 | PromptPreviewImageField | Текущее превью, замена, удаление |

### Фаза 5: Интеграция в промты (1–2 ч)

| # | Задача | Где |
|---|--------|-----|
| 5.1 | CreatePromptDialog | Добавить PromptPreviewImageField |
| 5.2 | EditPromptDialog | Добавить PromptPreviewImageField |
| 5.3 | PromptCard, HomePromptCard | Отображение превью (getOptimizedImageUrl) |
| 5.4 | Страница промта | Отображение превью |

### Фаза 6: Оптимизированная доставка (0.5 ч)

| # | Preset | Параметры |
|---|--------|-----------|
| 6.1 | thumbnail | f_auto,q_auto,c_fill,w_200,h_140 |
| 6.2 | card | f_auto,q_auto,c_fill,w_400,h_280 |
| 6.3 | large | f_auto,q_auto,w_1200 |

---

## 5. Детали реализации

### 5.1. lib/cloudinary.ts

- Папка: `prostore/prompts`
- Secure URLs
- Возврат: publicId, secureUrl, width, height, format, bytes, folder, resource_type

### 5.2. lib/file-validation.ts

- Разрешено: image/jpeg, image/png, image/webp
- Запрещено: gif, svg, pdf, прочие
- Макс. размер: 5 MB
- JSON-ошибки с понятным текстом

### 5.3. Авторизация

Использовать `auth()` из `@/auth`:

```ts
const session = await auth()
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
const userId = session.user.id
```

### 5.4. ImageUploader props

```ts
interface ImageUploaderProps {
  promptId?: string
  initialImageUrl?: string
  onUploaded?: (image: UploadedImage) => void
}
```

### 5.5. Cloudinary Dashboard

- Создать upload preset (опционально)
- Включить unsigned upload при необходимости
- Настроить folder: `prostore`

---

## 6. Бонусные пункты (комментарии в коде)

- Rate limiting для upload
- Заметка про virus scanning
- Хук для модерации
- Квоты по плану (free/pro)

---

## 7. Оценка трудозатрат

| Фаза | Оценка |
|------|--------|
| 1. Инфраструктура | 1–2 ч |
| 2. Схема и миграция | 0.5 ч |
| 3. API | 2–3 ч |
| 4. UI-компоненты | 2–3 ч |
| 5. Интеграция в промты | 1–2 ч |
| 6. Оптимизированная доставка | 0.5 ч |
| **Итого** | **7–11 ч** |

---

## 8. Чеклист перед стартом

- [x] Установить `cloudinary` ✅
- [x] Создать `.env.example` с переменными Cloudinary ✅
- [x] Создать `lib/cloudinary.ts` ✅
- [ ] Создать аккаунт Cloudinary
- [ ] Добавить переменные в .env (скопировать из .env.example)
- [x] Выполнить миграцию (Фаза 2) ✅
