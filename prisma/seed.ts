import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Очистка существующих данных
  await prisma.note.deleteMany()

  // Создание тестовых заметок
  const notes = await prisma.note.createMany({
    data: [
      { title: 'Первая заметка' },
      { title: 'Вторая заметка' },
      { title: 'Третья заметка' },
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

