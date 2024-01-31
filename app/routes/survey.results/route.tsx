import { Prisma } from '@prisma/client'
import { Await, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { Suspense, } from 'react'
import { LoaderFunctionArgs, defer } from '@remix-run/cloudflare'
import { Button } from '~/components/ui/button'
import { getPrisma } from '~/lib/prisma.server'

type CityStatEntry = {
  value: string
  label: string
  count: number
}

type CityStats = {
  entries: CityStatEntry[]
  count: number
}

export async function loader({ context }: LoaderFunctionArgs) {
  const prisma = getPrisma(context.env)

  const query = prisma.$queryRaw<[CityStats]>(Prisma.sql`
    WITH stats_inner AS (
      SELECT
        COUNT(s."id")::int as "count",
        c."name" as "value",
        c."label"
      FROM "public"."Survey" s
      RIGHT JOIN "public"."City" c
        ON c."id" = s."cityId"
      GROUP BY
        c."name",
        c."label"
      ORDER BY
        c."name" ASC
    )
    SELECT
      SUM(si."count")::int as "total",
      json_agg(si.* ORDER BY si."value" ASC) as "entries"
    FROM stats_inner si
  `)
    .then(([cityStats]: [CityStats]): CityStats => {
      return cityStats
    })
    .catch((error: unknown) => {
      const e = error as Error
      console.error(e)
      throw e
    })

  return defer({ query })
}

export default function Create() {
  const navigate = useNavigate()
  const handleNavigateBack = () => navigate(-1)

  // Note: `query` remains `fullfilled` even after revalidation
  const revalidator = useRevalidator()
  const { query } = useLoaderData<typeof loader>()

  const handleRefresh = () => {
    revalidator.revalidate()
  }

  return (
    <div className="bg-white h-full relative rounded-md shadow-md">
      <Button className="absolute top-0 left-0" variant="link" onClick={handleNavigateBack}>Go back</Button>
      <div className="h-full flex flex-col gap-8 items-center justify-center p-4">
        <h2 className="text-xl text-bold text-center drop-shadow-sm">
          Survey Results
        </h2>
        <div className="w-full md:max-w-[480px] mx-auto">
          <div className=''>
            <h3 className="mb-4 text-lg text-bold">
              Favourite Polish cities
            </h3>

            <Suspense fallback={<ResultStatsFallback />}>
              {
                /**
                 * `Suspense` / `Await` apply the lazy loading pattern only when the `query` hasn't been fulfilled yet.
                 * To update the UI after revalidation, we dynamically unmount the `Await` component and mount it again
                 * with the updated `query` value.
                 */
                revalidator.state === 'idle'
                  ? (
                    <Await resolve={query} errorElement={<ResultStatsError />}>
                      {renderCityStats}
                    </Await>
                  )
                  : <ResultStatsFallback />
              }
            </Suspense>
          </div>
          <div className="w-full mt-8 flex">
            <Button onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderCityStats(cityStats: CityStats) {
  return (
    <div className="flex flex-col gap-4">
      {cityStats.entries.map(({ value, label, count }) => (
        <div key={value} className="flex flex-row items-center gap-4">
          <div className="flex flex-col w-1/2">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-lg text-gray-800">{count}</span>
          </div>
          <div className="w-1/2">
            <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
              <div className="bg-sapphire-500 h-4" style={{ width: `${count * 100 / (cityStats.count)}%` }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ResultStatsFallback() {
  return (
    <div role="status" className="flex flex-col gap-4">
      {[...Array(4).keys()].map((value) => (
        <div key={value} className="flex flex-row items-center gap-4">
          <div className="flex flex-col w-1/2">
            <span className="text-sm text-gray-400">#{value + 1} </span>
            <span className="w-8 h-[35px] rounded-md bg-gray-300 animate-pulse text-gray-800"></span>
          </div>
          <div className="w-1/2">
            <div className="bg-gray-300 h-4 rounded-full overflow-hidden animate-pulse">
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ResultStatsError() {
  return (

    <div role="status" className="flex flex-col gap-4">
      {[...Array(4).keys()].map((value) => (
        <div key={value} className="flex flex-row items-center gap-4">
          <div className="flex flex-col w-1/2">
            <span className="text-sm text-red-300">#{value + 1} </span>
            <span className="w-8 h-[35px] rounded-md bg-red-400 animate-pulse"></span>
          </div>
          <div className="w-1/2">
            <div className="bg-red-400 h-4 rounded-full overflow-hidden animate-pulse">
            </div>
          </div>
        </div>
      ))}
      <span className="text-lg text-red-400 drop-shadow-sm">Error occurred while loading.</span>
    </div>
  )
}