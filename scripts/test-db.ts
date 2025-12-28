import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Тестирование базы данных...\n')

  try {
    // Создание тестового пользователя
    console.log('📝 Создание тестового пользователя...')
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Тестовый Пользователь',
      },
    })
    console.log(`✅ Пользователь создан: ${user.email} (ID: ${user.id})\n`)

    // Создание тестового промта
    console.log('📝 Создание тестового промта...')
    const prompt = await prisma.prompt.create({
      data: {
        title: 'Тестовый промт',
        content: 'Это содержимое тестового промта для проверки работы базы данных.',
        description: 'Описание тестового промта',
        visibility: 'PUBLIC',
        ownerId: user.id,
        publishedAt: new Date(),
      },
    })
    console.log(`✅ Промт создан: ${prompt.title} (ID: ${prompt.id})\n`)

    // Создание тестового голоса
    console.log('📝 Создание тестового голоса...')
    const vote = await prisma.vote.create({
      data: {
        userId: user.id,
        promptId: prompt.id,
        value: 1,
      },
    })
    console.log(`✅ Голос создан: значение ${vote.value} (ID: ${vote.id})\n`)

    // Проверка данных
    console.log('🔍 Проверка созданных данных...')
    const userWithData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        prompts: true,
        votes: true,
      },
    })

    if (userWithData) {
      console.log(`✅ Пользователь имеет ${userWithData.prompts.length} промт(ов)`)
      console.log(`✅ Пользователь имеет ${userWithData.votes.length} голос(ов)`)
    }

    const promptWithVotes = await prisma.prompt.findUnique({
      where: { id: prompt.id },
      include: {
        votes: true,
        owner: true,
      },
    })

    if (promptWithVotes) {
      console.log(`✅ Промт имеет ${promptWithVotes.votes.length} голос(ов)`)
      console.log(`✅ Владелец промта: ${promptWithVotes.owner.email}`)
    }

    console.log('\n✅ Все проверки пройдены успешно!')
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Тест не пройден:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



