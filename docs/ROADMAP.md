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

## 3. Картинки в промтах (Media Management)

**Подробный план:** [docs/MEDIA-MANAGEMENT-PLAN.md](./MEDIA-MANAGEMENT-PLAN.md)

### Кратко

- **Хранение:** Cloudinary
- **Схема:** модель `Image` + поля `previewImageUrl`, `previewImageId` в Prompt
- **API:** POST /api/images/upload, GET /api/images, DELETE /api/images/[id]
- **UI:** ImageUploader, ImageGallery, PromptPreviewImageField
- **Валидация:** jpeg, png, webp до 5 MB

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
