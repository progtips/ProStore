/**
 * Скрипт заполнения базы 100 стартовыми промтами с категориями, тегами и картинками
 * Запуск: npx tsx scripts/seed-prompts.ts
 */

import { PrismaClient } from '@prisma/client'
import { uploadImageFromUrl } from '@/lib/cloudinary'

const prisma = new PrismaClient()

// Шаблоны промтов по категориям (разнообразный контент)
const PROMPT_TEMPLATES: Array<{
  title: string
  description: string
  content: string
  category: string
  tags: string[]
}> = [
  // ChatGPT
  { title: 'Анализ текста на тональность', description: 'Определение эмоциональной окраски текста', content: 'Проанализируй следующий текст и определи его тональность (позитивная, негативная, нейтральная). Выдели ключевые слова, влияющие на общее впечатление.\n\n[ВСТАВЬ ТЕКСТ]', category: 'ChatGPT', tags: ['ChatGPT', 'Marketing'] },
  { title: 'Генерация идей для контента', description: 'Создание идей для блога и соцсетей', content: 'Сгенерируй 10 идей для контента на тему [ТЕМА]. Каждая идея должна включать заголовок, ключевую мысль и призыв к действию.', category: 'ChatGPT', tags: ['ChatGPT', 'Marketing'] },
  { title: 'Перевод с сохранением стиля', description: 'Перевод текста с учётом контекста', content: 'Переведи следующий текст на [ЯЗЫК], сохраняя авторский стиль, тон и культурные отсылки. Для идиом подбери эквиваленты.\n\n[ТЕКСТ]', category: 'ChatGPT', tags: ['ChatGPT'] },
  { title: 'Резюме длинного документа', description: 'Краткое изложение с ключевыми пунктами', content: 'Создай структурированное резюме документа. Включи: 1) главную мысль в 1-2 предложениях, 2) ключевые пункты списком, 3) выводы и рекомендации.', category: 'ChatGPT', tags: ['ChatGPT'] },
  { title: 'Написание продающего текста', description: 'Копирайтинг для лендингов', content: 'Напиши продающий текст для [ПРОДУКТ/УСЛУГА]. Используй структуру AIDA: привлечение внимания, интерес, желание, призыв к действию. Целевая аудитория: [ОПИСАНИЕ].', category: 'ChatGPT', tags: ['ChatGPT', 'Marketing'] },
  { title: 'Генерация FAQ', description: 'Вопросы и ответы для продукта', content: 'Создай 15 часто задаваемых вопросов и ответов для [ПРОДУКТ/СЕРВИС]. Вопросы должны покрывать: функционал, цены, интеграции, поддержку.', category: 'ChatGPT', tags: ['ChatGPT', 'Marketing'] },
  { title: 'Редактирование на ясность', description: 'Упрощение сложного текста', content: 'Перепиши следующий текст так, чтобы его понял человек без специальных знаний. Сохрани смысл, но используй простые слова и короткие предложения.\n\n[ТЕКСТ]', category: 'ChatGPT', tags: ['ChatGPT'] },
  { title: 'Генерация названий', description: 'Креативные названия для проектов', content: 'Придумай 20 вариантов названий для [ПРОЕКТ/ПРОДУКТ]. Учитывай: запоминаемость, уникальность, отражение сути. Стиль: [ПРОФЕССИОНАЛЬНЫЙ/ИГРИВЫЙ/МИНИМАЛИСТИЧНЫЙ].', category: 'ChatGPT', tags: ['ChatGPT', 'Design'] },
  { title: 'Проверка грамматики и стиля', description: 'Вычитка текста', content: 'Проверь текст на грамматические ошибки, стилистические недочёты и предложи улучшения. Сохрани авторский голос.\n\n[ТЕКСТ]', category: 'ChatGPT', tags: ['ChatGPT'] },
  { title: 'Создание персонажей для истории', description: 'Разработка героев', content: 'Создай 3-5 персонажей для [ЖАНР] истории. Для каждого: имя, возраст, характер, мотивация, слабости, связь с другими персонажами.', category: 'ChatGPT', tags: ['ChatGPT'] },
  // Midjourney
  { title: 'Портрет в стиле киберпанк', description: 'Неоновый портрет', content: 'portrait of [ОПИСАНИЕ], cyberpunk style, neon lights, rain, cinematic lighting, 8k, detailed --ar 2:3 --v 6', category: 'Midjourney', tags: ['Midjourney', 'Design'] },
  { title: 'Фэнтезийный пейзаж', description: 'Магический ландшафт', content: 'fantasy landscape, [ОПИСАНИЕ], magical atmosphere, dramatic sky, epic scale, detailed environment, artstation trending --ar 16:9 --v 6', category: 'Midjourney', tags: ['Midjourney', 'Design'] },
  { title: 'Минималистичный логотип', description: 'Абстрактный лого', content: 'minimalist logo for [КОМПАНИЯ/КОНЦЕПЦИЯ], flat design, vector style, clean lines, professional --v 6', category: 'Midjourney', tags: ['Midjourney', 'Design'] },
  { title: 'Архитектурная визуализация', description: 'Современное здание', content: 'architectural visualization, [ОПИСАНИЕ] building, modern design, golden hour, photorealistic, 8k --ar 3:2 --v 6', category: 'Midjourney', tags: ['Midjourney', 'Design'] },
  { title: 'Иллюстрация для детской книги', description: 'Мягкий стиль', content: 'children book illustration, [СЦЕНА], soft colors, whimsical, warm lighting, cozy atmosphere --ar 1:1 --v 6', category: 'Midjourney', tags: ['Midjourney', 'Design'] },
  { title: 'Научная фантастика', description: 'Космическая сцена', content: 'sci-fi scene, [ОПИСАНИЕ], futuristic, detailed machinery, atmospheric, movie still --ar 16:9 --v 6', category: 'Midjourney', tags: ['Midjourney'] },
  { title: 'Фуд-фотография', description: 'Аппетитное блюдо', content: 'food photography, [БЛЮДО], professional lighting, appetizing, shallow depth of field, magazine quality --ar 4:5 --v 6', category: 'Midjourney', tags: ['Midjourney', 'Marketing'] },
  { title: 'Аниме персонаж', description: 'Стиль аниме', content: 'anime character design, [ОПИСАНИЕ], detailed eyes, dynamic pose, vibrant colors, high quality --ar 2:3 --v 6', category: 'Midjourney', tags: ['Midjourney', 'Design'] },
  { title: 'Ретро постер', description: 'Винтажный стиль', content: 'retro poster, [ТЕМА], 70s style, vintage colors, typography, grain texture --ar 3:4 --v 6', category: 'Midjourney', tags: ['Midjourney', 'Design', 'Marketing'] },
  { title: 'Абстрактная текстура', description: 'Для фона', content: 'abstract texture, [ЦВЕТА], seamless pattern, subtle gradient, usable as background --tile --v 6', category: 'Midjourney', tags: ['Midjourney', 'Design'] },
  // Development
  { title: 'Генерация React-компонента', description: 'Компонент с TypeScript', content: 'Создай React-компонент [НАЗВАНИЕ] с TypeScript. Требования: [ОПИСАНИЕ]. Используй функциональный компонент, хуки, пропсы с типами.', category: 'Development', tags: ['JavaScript', 'Development'] },
  { title: 'SQL-запрос для аналитики', description: 'Сложный запрос', content: 'Напиши SQL-запрос для [ЗАДАЧА]. Таблицы: [ОПИСАНИЕ СТРУКТУРЫ]. Нужно: [ОЖИДАЕМЫЙ РЕЗУЛЬТАТ]. Оптимизируй для PostgreSQL.', category: 'Development', tags: ['Development'] },
  { title: 'Рефакторинг функции', description: 'Улучшение кода', content: 'Отрефактори следующий код. Улучши читаемость, добавь типы, разбей на мелкие функции. Сохрани логику.\n\n```\n[КОД]\n```', category: 'Development', tags: ['Development', 'JavaScript'] },
  { title: 'Написание unit-теста', description: 'Jest/Vitest тест', content: 'Напиши unit-тесты для функции/компонента [НАЗВАНИЕ]. Покрой основные сценарии, граничные случаи и ошибки. Используй [Jest/Vitest].', category: 'Development', tags: ['Development', 'JavaScript'] },
  { title: 'Документация API', description: 'OpenAPI спецификация', content: 'Создай OpenAPI 3.0 спецификацию для API [ОПИСАНИЕ]. Включи все эндпоинты, схемы данных, примеры запросов и ответов.', category: 'Development', tags: ['Development'] },
  { title: 'Оптимизация производительности', description: 'Анализ узких мест', content: 'Проанализируй код на узкие места производительности. Предложи оптимизации с обоснованием. Код:\n\n```\n[КОД]\n```', category: 'Development', tags: ['Development'] },
  { title: 'Миграция базы данных', description: 'Prisma/TypeORM миграция', content: 'Создай миграцию для [ОПИСАНИЕ ИЗМЕНЕНИЙ]. Используй [Prisma/TypeORM]. Учти обратную совместимость и данные в продакшене.', category: 'Development', tags: ['Development'] },
  { title: 'Docker Compose конфиг', description: 'Мультиконтейнерное приложение', content: 'Создай docker-compose.yml для приложения: [СПИСОК СЕРВИСОВ]. Включи volumes, networks, переменные окружения.', category: 'Development', tags: ['Development'] },
  { title: 'Обработка ошибок', description: 'Error boundary и fallback', content: 'Реализуй централизованную обработку ошибок для [СТЕК]. Включи логирование, уведомления, пользовательский fallback UI.', category: 'Development', tags: ['Development', 'JavaScript'] },
  { title: 'Генерация типов из API', description: 'TypeScript типы', content: 'Сгенерируй TypeScript типы и интерфейсы из JSON ответа API:\n\n[JSON]\n\nДобавь JSDoc для полей.', category: 'Development', tags: ['Development', 'JavaScript'] },
  // Python
  { title: 'Парсинг данных', description: 'BeautifulSoup/Scrapy', content: 'Напиши скрипт на Python для парсинга [ИСТОЧНИК]. Используй [BeautifulSoup/Scrapy]. Сохрани результат в CSV/JSON. Обработай ошибки и rate limiting.', category: 'Python', tags: ['Python', 'Development'] },
  { title: 'Обработка DataFrame', description: 'Pandas операции', content: 'Напиши код на Pandas для [ЗАДАЧА]. Данные: [ОПИСАНИЕ]. Включи: очистку, фильтрацию, агрегацию, вывод результата.', category: 'Python', tags: ['Python', 'Development'] },
  { title: 'FastAPI эндпоинт', description: 'REST API', content: 'Создай FastAPI эндпоинт для [ОПИСАНИЕ]. Включи: Pydantic модели, валидацию, обработку ошибок, документацию.', category: 'Python', tags: ['Python', 'Development'] },
  { title: 'Асинхронная загрузка', description: 'asyncio и aiohttp', content: 'Напиши асинхронный скрипт для параллельной загрузки [URLs/файлов]. Используй asyncio и aiohttp. Ограничь concurrency до 10.', category: 'Python', tags: ['Python', 'Development'] },
  { title: 'Декоратор с логированием', description: 'Python декоратор', content: 'Создай декоратор, который логирует вызовы функции: имя, аргументы, результат, время выполнения. Используй functools.wraps.', category: 'Python', tags: ['Python', 'Development'] },
  { title: 'Контекстный менеджер', description: 'with statement', content: 'Реализуй контекстный менеджер для [ЗАДАЧА]. Должен корректно обрабатывать исключения и освобождать ресурсы.', category: 'Python', tags: ['Python', 'Development'] },
  { title: 'Тесты с pytest', description: 'Фикстуры и параметризация', content: 'Напиши pytest тесты для [МОДУЛЬ]. Используй фикстуры, parametrize для разных входов, моки для внешних зависимостей.', category: 'Python', tags: ['Python', 'Development'] },
  { title: 'Обработка изображений', description: 'Pillow/OpenCV', content: 'Напиши скрипт для [ОПИСАНИЕ ОБРАБОТКИ] изображений. Используй [Pillow/OpenCV]. Поддержка batch обработки.', category: 'Python', tags: ['Python', 'Development'] },
  { title: 'Работа с Excel', description: 'openpyxl', content: 'Создай скрипт для чтения/записи Excel файла. [ОПИСАНИЕ СТРУКТУРЫ]. Обработай несколько листов, форматирование.', category: 'Python', tags: ['Python', 'Development'] },
  { title: 'Валидация данных', description: 'Pydantic модель', content: 'Создай Pydantic модель для валидации [ОПИСАНИЕ ДАННЫХ]. Включи кастомные валидаторы, преобразования типов, понятные сообщения об ошибках.', category: 'Python', tags: ['Python', 'Development'] },
  // JavaScript
  { title: 'Хук useDebounce', description: 'Debounce для React', content: 'Реализуй хук useDebounce(value, delay) для React. Возвращай debounced значение. Добавь очистку при размонтировании.', category: 'JavaScript', tags: ['JavaScript', 'Development'] },
  { title: 'Промисы с retry', description: 'Повтор при ошибке', content: 'Создай функцию retry(fn, options) для повторного вызова промиса при ошибке. Опции: maxAttempts, delay, backoff.', category: 'JavaScript', tags: ['JavaScript', 'Development'] },
  { title: 'Форматирование даты', description: 'Intl.DateTimeFormat', content: 'Создай утилиту formatDate(date, locale, options) используя Intl.DateTimeFormat. Поддержка относительного времени (вчера, 2 часа назад).', category: 'JavaScript', tags: ['JavaScript', 'Development'] },
  { title: 'Валидация формы', description: 'React Hook Form', content: 'Реализуй валидацию формы с React Hook Form. Поля: [ОПИСАНИЕ]. Валидаторы: required, email, min/max length. Показ ошибок под полями.', category: 'JavaScript', tags: ['JavaScript', 'Development'] },
  { title: 'Бесконечный скролл', description: 'Intersection Observer', content: 'Реализуй бесконечный скролл с Intersection Observer. Загружай данные при достижении низа списка. Обработай loading и конец списка.', category: 'JavaScript', tags: ['JavaScript', 'Development'] },
  { title: 'Локализация приложения', description: 'i18n setup', content: 'Настрой i18n для React приложения. Поддержка [ЯЗЫКИ]. Переключение языка, плюрализация, форматирование чисел и дат.', category: 'JavaScript', tags: ['JavaScript', 'Development'] },
  { title: 'Оптимизация рендера', description: 'React.memo и useMemo', content: 'Оптимизируй рендер компонента [ОПИСАНИЕ]. Используй React.memo, useMemo, useCallback где уместно. Объясни каждое решение.', category: 'JavaScript', tags: ['JavaScript', 'Development'] },
  { title: 'Работа с URL', description: 'URLSearchParams', content: 'Создай утилиты для работы с query параметрами: getParam, setParam, removeParam. Синхронизация с React state/history.', category: 'JavaScript', tags: ['JavaScript', 'Development'] },
  { title: 'Обработка загрузки файлов', description: 'Drag and drop', content: 'Реализуй компонент загрузки файлов с drag-and-drop. Валидация типа и размера. Превью для изображений. Progress bar.', category: 'JavaScript', tags: ['JavaScript', 'Development', 'Design'] },
  { title: 'Тёмная тема', description: 'CSS variables и React', content: 'Реализуй переключение тёмной/светлой темы. Используй CSS variables. Сохраняй выбор в localStorage. Без мерцания при загрузке.', category: 'JavaScript', tags: ['JavaScript', 'Development', 'Design'] },
  // Marketing
  { title: 'Email-рассылка', description: 'Цепочка писем', content: 'Создай структуру welcome-цепочки из 5 писем для [ПРОДУКТ]. Каждое письмо: цель, заголовок, основной текст, CTA. Интервалы между письмами.', category: 'Marketing', tags: ['Marketing', 'ChatGPT'] },
  { title: 'Мета-описание для SEO', description: 'Оптимизация сниппета', content: 'Напиши 3 варианта meta description для страницы [ТЕМА]. До 160 символов. Включи ключевые слова, призыв к действию.', category: 'Marketing', tags: ['Marketing'] },
  { title: 'Сценарий для видео', description: 'Рекламный ролик', content: 'Напиши сценарий 60-секундного рекламного видео для [ПРОДУКТ]. Структура: крючок (5 сек), проблема (15 сек), решение (25 сек), CTA (15 сек).', category: 'Marketing', tags: ['Marketing', 'ChatGPT'] },
  { title: 'Контент-план', description: 'Месячный план', content: 'Создай контент-план на месяц для [НИША] в соцсетях. 3-5 постов в неделю. Разные форматы: образовательный, развлекательный, продающий.', category: 'Marketing', tags: ['Marketing', 'ChatGPT'] },
  { title: 'A/B тест гипотезы', description: 'Идеи для тестирования', content: 'Сгенерируй 10 гипотез для A/B тестирования на лендинге [ПРОДУКТ]. Каждая: что тестируем, метрика успеха, ожидаемый эффект.', category: 'Marketing', tags: ['Marketing'] },
  { title: 'Описание для App Store', description: 'ASO оптимизация', content: 'Напиши описание приложения для App Store/Google Play. [ОПИСАНИЕ ПРИЛОЖЕНИЯ]. Ключевые слова, структура, призыв к установке.', category: 'Marketing', tags: ['Marketing'] },
  { title: 'Презентация продукта', description: 'Pitch deck структура', content: 'Создай структуру pitch deck для [ПРОДУКТ]. Слайды: проблема, решение, рынок, продукт, бизнес-модель, команда, призыв. Ключевые тезисы для каждого.', category: 'Marketing', tags: ['Marketing', 'ChatGPT'] },
  { title: 'Отзывы и кейсы', description: 'Социальное доказательство', content: 'Напиши 5 шаблонов запросов отзывов у клиентов. Разные форматы: короткий отзыв, кейс с цифрами, видео-отзыв. Включи вопросы.', category: 'Marketing', tags: ['Marketing'] },
  { title: 'UGC контент', description: 'Контент от пользователей', content: 'Создай бриф для UGC-креаторов. Продукт: [ОПИСАНИЕ]. Требования к формату, ключевые месседжи, что показать, хештеги.', category: 'Marketing', tags: ['Marketing'] },
  { title: 'Реферальная программа', description: 'Механика приглашений', content: 'Разработай механику реферальной программы для [ПРОДУКТ]. Награды для приглашающего и приглашённого. Как отслеживать. Тексты для шаринга.', category: 'Marketing', tags: ['Marketing'] },
  // Design
  { title: 'Мудборд', description: 'Направление дизайна', content: 'Создай мудборд для [ПРОЕКТ]. Включи: цветовую палитру (hex), 5-7 референсов, шрифтовые пары, ключевые визуальные элементы.', category: 'Design', tags: ['Design'] },
  { title: 'User flow', description: 'Карта пользовательского пути', content: 'Опиши user flow для [ДЕЙСТВИЕ] в приложении [ОПИСАНИЕ]. От точки входа до цели. Укажи экраны, решения, возможные ошибки.', category: 'Design', tags: ['Design', 'Development'] },
  { title: 'Компонентная библиотека', description: 'Design system', content: 'Опиши структуру компонентной библиотеки для [ПРОЕКТ]. Кнопки, инпуты, карточки, модалки. Варианты, состояния, токены дизайна.', category: 'Design', tags: ['Design', 'Development'] },
  { title: 'Микроанимации', description: 'UX анимации', content: 'Предложи микроанимации для [ЭЛЕМЕНТЫ UI]. Для каждой: триггер, длительность, easing, цель (обратная связь, направление внимания).', category: 'Design', tags: ['Design', 'Development'] },
  { title: 'Адаптивная сетка', description: 'Breakpoints', content: 'Опиши адаптивную сетку для [ТИП САЙТА]. Breakpoints, колонки, отступы. Примеры для мобильного, планшета, десктопа.', category: 'Design', tags: ['Design', 'Development'] },
  { title: 'Иконки и пиктограммы', description: 'Визуальный язык', content: 'Определи стиль иконок для [ПРОЕКТ]: линейные/заливка, размеры, stroke width. Список необходимых иконок для [ФУНКЦИОНАЛ].', category: 'Design', tags: ['Design'] },
  { title: 'Пустые состояния', description: 'Empty states', content: 'Спроектируй empty states для [ЭКРАНЫ]: нет данных, ошибка, первый вход. Иллюстрация, текст, CTA для каждого случая.', category: 'Design', tags: ['Design'] },
  { title: 'Ошибки и уведомления', description: 'Feedback система', content: 'Опиши систему уведомлений: типы (success, error, warning, info), размещение, длительность, анимации. Примеры текстов.', category: 'Design', tags: ['Design', 'Development'] },
  { title: 'Доступность', description: 'a11y чеклист', content: 'Создай чеклист доступности для [КОМПОНЕНТ/СТРАНИЦА]. Контраст, фокус, семантика, скринридеры, клавиатурная навигация.', category: 'Design', tags: ['Design', 'Development'] },
  { title: 'Онбординг', description: 'Первое знакомство', content: 'Спроектируй онбординг для [ПРОДУКТ]. 3-5 шагов. Что показать, в каком порядке. Скип, прогресс, сохранение состояния.', category: 'Design', tags: ['Design'] },
  // Claude
  { title: 'Длинный анализ документа', description: 'Глубокий разбор', content: 'Проанализируй документ [ССЫЛКА/ТЕКСТ]. Выдели ключевые тезисы, противоречия, неочевидные связи. Напиши развёрнутое заключение на 500+ слов.', category: 'Claude', tags: ['Claude', 'ChatGPT'] },
  { title: 'Сравнительный анализ', description: 'Сопоставление вариантов', content: 'Сравни [ВАРИАНТ A] и [ВАРИАНТ B] по критериям: [СПИСОК]. Таблица сравнения, плюсы/минусы, рекомендация с обоснованием.', category: 'Claude', tags: ['Claude'] },
  { title: 'Структурирование хаоса', description: 'Организация информации', content: 'У меня есть разрозненные заметки о [ТЕМА]. Структурируй их в логичный документ с разделами, подразделами и выводами.', category: 'Claude', tags: ['Claude', 'ChatGPT'] },
  { title: 'Техническая документация', description: 'Подробная документация', content: 'Напиши техническую документацию для [СИСТЕМА/API]. Включи: обзор, архитектура, примеры использования, troubleshooting.', category: 'Claude', tags: ['Claude', 'Development'] },
  { title: 'Код-ревью чеклист', description: 'Проверка кода', content: 'Создай чеклист для код-ревью [ЯЗЫК/ФРЕЙМВОРК]. Категории: безопасность, производительность, читаемость, тесты, документация.', category: 'Claude', tags: ['Claude', 'Development'] },
  { title: 'Генерация тест-кейсов', description: 'QA сценарии', content: 'Сгенерируй тест-кейсы для [ФУНКЦИОНАЛ]. Включи: позитивные, негативные, граничные. Формат: шаги, ожидаемый результат, приоритет.', category: 'Claude', tags: ['Claude', 'Development'] },
  { title: 'Рефакторинг план', description: 'Пошаговый план', content: 'Создай план рефакторинга для [ПРОЕКТ/МОДУЛЬ]. Этапы от безопасных к рискованным. Для каждого: что делать, как проверить, откат.', category: 'Claude', tags: ['Claude', 'Development'] },
  { title: 'Миграция гайд', description: 'Переход на новую версию', content: 'Напиши гайд миграции с [СТАРАЯ ВЕРСИЯ] на [НОВАЯ]. Breaking changes, пошаговые инструкции, чеклист проверки после миграции.', category: 'Claude', tags: ['Claude', 'Development'] },
  { title: 'Архитектурное решение', description: 'ADR документ', content: 'Напиши Architecture Decision Record для [РЕШЕНИЕ]. Контекст, варианты, решение, последствия. Формат ADR.', category: 'Claude', tags: ['Claude', 'Development'] },
  { title: 'Руководство по стилю', description: 'Style guide', content: 'Создай руководство по стилю кода для [ЯЗЫК/ПРОЕКТ]. Форматирование, нейминг, структура файлов, антипаттерны, примеры.', category: 'Claude', tags: ['Claude', 'Development'] },
]

// Дублируем и варьируем до 100
function expandTo100(): typeof PROMPT_TEMPLATES {
  const result = [...PROMPT_TEMPLATES]
  const variations = [' (улучшенный)', ' v2', ' — продвинутый', ' для начинающих', ' — полный гайд']
  while (result.length < 100) {
    const i = result.length % PROMPT_TEMPLATES.length
    const base = PROMPT_TEMPLATES[i]
    const v = variations[result.length % variations.length]
    result.push({
      ...base,
      title: base.title + v,
      content: base.content + '\n\n---\nВариация: адаптируй под свой кейс.',
    })
  }
  return result.slice(0, 100)
}

async function main() {
  console.log('🌱 Заполнение 100 стартовых промтов...')

  const prompts = expandTo100()

  const testUser = await prisma.user.findFirst({ where: { email: 'test@example.com' } })
  if (testUser) {
    const deleted = await prisma.prompt.deleteMany({ where: { ownerId: testUser.id } })
    if (deleted.count > 0) {
      console.log(`  Удалено ${deleted.count} старых промтов пользователя test@example.com`)
    }
  }
  if (!testUser) {
    console.error('❌ Сначала выполните npm run db:seed для создания тестового пользователя')
    process.exit(1)
  }

  const categories = await prisma.category.findMany()
  const tags = await prisma.tag.findMany()
  if (categories.length === 0 || tags.length === 0) {
    console.error('❌ Сначала выполните npm run db:seed для создания категорий и тегов')
    process.exit(1)
  }

  const catMap = new Map(categories.map((c) => [c.category, c.id]))
  const tagMap = new Map(tags.map((t) => [t.name, t.id]))

  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET

  if (!hasCloudinary) {
    console.log('⚠️ Cloudinary не настроен — промты будут без картинок')
  }

  let uploaded = 0
  for (let i = 0; i < prompts.length; i++) {
    const p = prompts[i]
    const categoryId = catMap.get(p.category) ?? null
    const tagIds = p.tags
      .map((t) => tagMap.get(t))
      .filter(Boolean) as string[]

    let previewImageUrl: string | null = null
    let previewImageId: string | null = null

    if (hasCloudinary) {
      try {
        const imgUrl = `https://picsum.photos/seed/${i + 1000}/800/400`
        const result = await uploadImageFromUrl(imgUrl)
        previewImageUrl = result.secureUrl
        previewImageId = result.publicId

        const imageRecord = await prisma.image.create({
          data: {
            url: result.url,
            secureUrl: result.secureUrl,
            publicId: result.publicId,
            format: result.format ?? undefined,
            bytes: result.bytes ?? undefined,
            width: result.width ?? undefined,
            height: result.height ?? undefined,
            folder: result.folder ?? undefined,
            resourceType: result.resourceType ?? undefined,
            ownerId: testUser.id,
          },
        })

        const promptRecord = await prisma.prompt.create({
          data: {
            title: p.title,
            content: p.content,
            description: p.description,
            isPublic: true,
            visibility: 'PUBLIC',
            ownerId: testUser.id,
            categoryId,
            previewImageUrl,
            previewImageId,
            tags: { connect: tagIds.map((id) => ({ id })) },
          },
        })

        await prisma.image.update({
          where: { id: imageRecord.id },
          data: { promptId: promptRecord.id },
        })

        uploaded++
      } catch (err) {
        console.warn(`Промт ${i + 1}: ошибка загрузки картинки, создаю без неё`, (err as Error).message)
        await prisma.prompt.create({
          data: {
            title: p.title,
            content: p.content,
            description: p.description,
            isPublic: true,
            visibility: 'PUBLIC',
            ownerId: testUser.id,
            categoryId,
            tags: { connect: tagIds.map((id) => ({ id })) },
          },
        })
      }
    } else {
      await prisma.prompt.create({
        data: {
          title: p.title,
          content: p.content,
          description: p.description,
          isPublic: true,
          visibility: 'PUBLIC',
          ownerId: testUser.id,
          categoryId,
          tags: { connect: tagIds.map((id) => ({ id })) },
        },
      })
    }

    if ((i + 1) % 10 === 0) {
      console.log(`  Создано ${i + 1}/100 промтов...`)
    }
    if (hasCloudinary && (i + 1) % 20 === 0) {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  console.log(`✅ Создано 100 промтов (с картинками: ${uploaded})`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
