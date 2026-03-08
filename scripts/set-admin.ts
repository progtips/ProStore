import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'info@sheremetev.info'

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  })

  if (!user) {
    console.log(`⚠️ Пользователь ${ADMIN_EMAIL} не найден в базе.`)
    console.log('   Войдите в систему через OAuth, затем запустите скрипт снова.')
    return
  }

  await prisma.user.update({
    where: { email: ADMIN_EMAIL },
    data: { role: 'admin' },
  })

  console.log(`✅ Пользователь ${ADMIN_EMAIL} назначен администратором.`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
