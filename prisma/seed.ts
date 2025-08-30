import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Creare i tavoli
  const tables = await Promise.all([
    prisma.table.create({ data: { name: 'Tavolo 1 - Famiglia Dario' } }),
    prisma.table.create({ data: { name: 'Tavolo 2 - Famiglia Roberta' } }),
    prisma.table.create({ data: { name: 'Tavolo 3 - Amici Dario' } }),
    prisma.table.create({ data: { name: 'Tavolo 4 - Amici Roberta' } }),
    prisma.table.create({ data: { name: 'Tavolo 5 - Colleghi' } }),
    prisma.table.create({ data: { name: 'Tavolo 6 - Invitati Speciali' } }),
  ])

  // Creare i task
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Selfie del Tavolo',
        description: 'Fai un selfie di gruppo con il tuo tavolo',
        score: 50,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Momento di Gioia',
        description: 'Cattura un momento di risata spontanea',
        score: 30,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Foto con gli Sposi',
        description: 'Foto con gli sposi',
        score: 100,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Brindisi Speciale',
        description: 'Video di un brindisi',
        score: 75,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Food Photography',
        description: 'Foto del cibo più bello',
        score: 25,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Decorazioni Eleganti',
        description: 'Selfie con decorazioni della sala',
        score: 20,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Ballo di Gruppo',
        description: 'Video di una danza di gruppo',
        score: 80,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Famiglia degli Sposi',
        description: 'Foto con i genitori degli sposi',
        score: 60,
      },
    }),
  ])

  console.log('Database seeded successfully!')
  console.log('Tables created:', tables.length)
  console.log('Tasks created:', tasks.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
