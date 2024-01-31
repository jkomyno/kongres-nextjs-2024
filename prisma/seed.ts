import { City } from '@prisma/client'
import { getPrisma } from '~/lib/prisma.server'

async function main() {
  const prisma = getPrisma(process.env)
  await prisma.survey.deleteMany();

  const seed: Record<keyof typeof City, number> = {
    WROCLAW: 50 / 5,
    GDANSK: 100 / 5,
    KRAKOW: 75 / 5,
    WARSZAWA: 25 / 5,
  };

  const inputData = Object.entries(seed)
    .map(([city, count]) => Array.from({ length: count })
      .map(_ => ({ city: city as City }))
    ).flat();

  console.log('inputData')
  console.dir(inputData, { depth: null })
    
  await prisma.survey.createMany({
    data: inputData,
  });

  // [
  //   { _count: 5, city: 'WARSZAWA' },
  //   { _count: 15, city: 'KRAKOW' },
  //   { _count: 10, city: 'WROCLAW' },
  //   { _count: 20, city: 'GDANSK' }
  // ]
  //
  // See: https://github.com/prisma/prisma/issues/17276#issuecomment-1918209602
  const groupBy = await prisma.survey.groupBy({
    by: ['city'],
    _count: true,
    orderBy: {
      city: 'asc',
    },
  })

  console.log('groupBy')
  console.dir(groupBy)
}

main()