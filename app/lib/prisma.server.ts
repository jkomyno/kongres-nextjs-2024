import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

type GetPrismaArgs = {
  DATABASE_URL?: string

  // This is to satisfy `process.env` as well (e.g., for `prisma db seed`).
  [key: string]: string | undefined
}

export function getPrisma(env: GetPrismaArgs) {
  const connectionString = `${env.DATABASE_URL!}`

  const neon = new Pool({ connectionString })
  const adapter = new PrismaNeon(neon)
  const prisma = new PrismaClient({
    adapter,
  })

  prisma.$connect()

  return prisma
}
