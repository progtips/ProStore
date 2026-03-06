# План доработок ProStore

## Текущее состояние

| Функция | Схема БД | UI (создание/редактирование) | Actions | Отображение |
|---------|----------|------------------------------|---------|-------------|
| **Теги** | ✅ Tag, many-to-many | ✅ TagsInput | ✅ create/update | ✅ Карточки, страница промта |
| **Категории** | ✅ Category, Prompt.categoryId | ❌ Нет | ❌ Нет | ✅ Карточки, страница промта |
| **Картинки** | ❌ Нет | ❌ Нет | ❌ Нет | ❌ Нет |

---

## 1. Теги в промтах ✅

### Реализовано
- В `createPrompt`: принимает `tags` (строка через запятую), создаёт/связывает через connectOrCreate
- В `updatePrompt`: принимает `tags`, заменяет связь через set
- **CreatePromptDialog** и **EditPromptDialog**: компонент TagsInput (chips, Enter/запятая для добавления)
- Seed: 8 тегов (Python, JavaScript, ChatGPT, Midjourney, Claude, Development, Marketing, Design)

---

## 2. Категории в промтах

### Что есть
- Модель `Category` с полем `category` (unique)
- `Prompt.categoryId` (опционально)
- Категории отображаются в карточках

### Что сделать

#### 2.1. API и actions
- [ ] В `createPrompt`: принимать `categoryId` или `category` (строка)
- [ ] В `updatePrompt`: принимать `categoryId`, обновлять связь
- [ ] Добавить `getCategories()` для списка категорий в селекте
- [ ] При передаче строки — создавать категорию, если её нет (или только выбирать из существующих)

#### 2.2. UI
- [ ] **CreatePromptDialog**: выпадающий список категорий (select)
- [ ] **EditPromptDialog**: тот же select с текущей категорией
- [ ] Опция «Без категории» (null)

#### 2.3. Seed
- [ ] Добавить категории (Development, Midjourney, ChatGPT, Marketing и т.п.)
- [ ] Привязать категории к тестовым промтам

---

## 3. Картинки в промтах

### Что нужно добавить

#### 3.1. Схема БД
- [ ] Вариант A: поле `imageUrl` в `Prompt` (одна картинка, URL)
- [ ] Вариант B: модель `PromptImage` (несколько картинок на промт)

Рекомендация: начать с **одной картинки** (`imageUrl`) для простоты.

```prisma
model Prompt {
  // ... существующие поля
  imageUrl String?  // URL загруженного изображения
}
```

#### 3.2. Хранение файлов
Варианты:
- **Vercel Blob** — просто, подходит для Vercel
- **Cloudinary** — бесплатный tier, CDN
- **AWS S3** — гибко, но сложнее настройка
- **Локально** — `public/uploads/` (не подходит для Vercel serverless)

Рекомендация: **Vercel Blob** или **Cloudinary**.

#### 3.3. API
- [ ] API route `POST /api/upload` для загрузки изображения
- [ ] В `createPrompt` / `updatePrompt`: принимать `imageUrl` или загружать файл
- [ ] Валидация: размер (например, до 2 MB), форматы (jpg, png, webp)

#### 3.4. UI
- [ ] **CreatePromptDialog**: блок загрузки (drag-and-drop или кнопка)
- [ ] **EditPromptDialog**: превью текущей картинки, возможность заменить/удалить
- [ ] **PromptCard**, **HomePromptCard**, страница промта: отображение картинки (или placeholder)

#### 3.5. Миграция
- [ ] `prisma migrate dev --name add_prompt_image`

---

## Порядок реализации

| Этап | Задача | Зависимости |
|------|--------|-------------|
| 1 | Теги: actions + UI | — |
| 2 | Категории: actions + UI | — |
| 3 | Seed: теги и категории | Этапы 1–2 |
| 4 | Картинки: схема + миграция | — |
| 5 | Картинки: хранение (Vercel Blob/Cloudinary) | Этап 4 |
| 6 | Картинки: API upload + UI | Этап 5 |

---

## Оценка трудозатрат

| Задача | Оценка |
|--------|--------|
| Теги (actions + UI) | 2–3 ч |
| Категории (actions + UI) | 1–2 ч |
| Картинки (схема + upload + UI) | 4–6 ч |
| **Итого** | **7–11 ч** |
