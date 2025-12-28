import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Очистка существующих данных
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
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

