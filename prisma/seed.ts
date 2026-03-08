import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Очистка существующих данных (не удаляем пользователей и аккаунты)
  await prisma.note.deleteMany()

  // Создаем тестового пользователя, если его нет
  let testUser = await prisma.user.findFirst({
    where: { email: 'test@example.com' },
  })

  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    })
    console.log('✅ Created test user')
  }

  // Создание тестовых заметок с ownerId
  const notes = await prisma.note.createMany({
    data: [
      { title: 'Первая заметка', ownerId: testUser.id },
      { title: 'Вторая заметка', ownerId: testUser.id },
      { title: 'Третья заметка', ownerId: testUser.id },
    ],
  })
  console.log(`✅ Created ${notes.count} notes`)

  // Создание тегов (если не существуют)
  const tagNames = ['Python', 'JavaScript', 'ChatGPT', 'Midjourney', 'Claude', 'Development', 'Marketing', 'Design']
  for (const name of tagNames) {
    await prisma.tag.upsert({
      where: { name },
      create: { name },
      update: {},
    })
  }
  console.log(`✅ Created/updated ${tagNames.length} tags`)

  // Создание категорий (если не существуют)
  const categoryNames = ['Development', 'Midjourney', 'ChatGPT', 'Marketing', 'Design', 'Claude', 'Python', 'JavaScript']
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { category: name },
      create: { category: name },
      update: {},
    })
  }
  console.log(`✅ Created/updated ${categoryNames.length} categories`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

