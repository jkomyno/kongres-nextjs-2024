/* eslint-disable @typescript-eslint/no-unused-vars */
import { getPrisma } from '~/lib/prisma.server'

export const cities = [
  {
    value: 'warszawa',
    label: 'Warszawa',
  },
  {
    value: 'krakow',
    label: 'Kraków',
  },
  {
    value: 'wroclaw',
    label: 'Wrocław',
  },
  {
    value: 'gdansk',
    label: 'Gdańsk',
  },
] as const

async function main() {
  const prisma = getPrisma(process.env)

  await prisma.survey.deleteMany()
  await prisma.city.deleteMany()
  await createCities(prisma)
  await createSurveys(prisma)

  const groupBy = await prisma.$queryRaw<Array<{ count: number, city: string, label: string }>>`
    SELECT
      COUNT(s."id")::int AS "count",
      c."name" AS "city",
      c."label" AS "label"
    FROM "public"."Survey" s
    RIGHT JOIN "public"."City" c
      ON c."id" = s."cityId"
    GROUP BY
      c."name",
      c."label"
    ORDER BY
      c."name" ASC
  `

  console.log('groupBy')
  console.dir(groupBy)
}

main()

async function createCities(prisma: ReturnType<typeof getPrisma>) {
  const citiesInput = cities.map(({ value, label }, i) => ({ name: value, label, id: i + 1 }))

  await prisma.city.createMany({
    data: citiesInput,
  })
}

async function createSurveys(prisma: ReturnType<typeof getPrisma>) {
  const seed = cities.map(({ value }) => ({
    name: value,
    count: Math.floor(Math.random() * 100) + 1,
  }))

  const surveysInput = seed
    .map(({ count }, i) => Array.from({ length: count })
      .map(_ => ({ cityId: i + 1 }))
    ).flat()

  await prisma.survey.createMany({
    data: surveysInput,
  })
}
