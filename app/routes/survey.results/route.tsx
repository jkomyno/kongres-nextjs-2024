import { Await, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react';
import { Suspense, } from 'react';
import { defer } from '@remix-run/cloudflare';
import { Button } from '~/components/ui/button';
import { choices } from "~/lib/choices";

type CityStatEntry = {
  value: string
  label: string
  count: number
}

type CityStats = {
  entries: CityStatEntry[]
  count: number
}

export async function loader() {
  const query = new Promise<CityStats>((resolve) => {
    const cityStatEntries: CityStatEntry[] = choices.map(({ value, label }) => ({
      value,
      label,
      count: Math.floor(Math.random() * 100) + 1,
    }));

    const cityStats: CityStats = {
      entries: cityStatEntries,
      count: cityStatEntries.reduce((acc, { count }) => acc + count, 0),
    };

    setTimeout(() => {
      resolve(cityStats);
      // reject(new Error('Something went wrong'));
    }, 2000);
  })

  return defer({ query });
}

export default function Create() {
  const navigate = useNavigate();
  const handleNavigateBack = () => navigate(-1);

  // Note: `query` remains `fullfilled` even after revalidation
  const revalidator = useRevalidator();
  const { query } = useLoaderData<typeof loader>();

  const handleRefresh = () => {
    revalidator.revalidate();
  }

  return (
    <div className="bg-white h-full">
      <Button variant="link" onClick={handleNavigateBack}>Go back</Button>
      <div className="max-w-screen-xl flex flex-col flex-wrap items-center justify-between mx-auto p-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <h2 className="mt-8 mb-8 text-xl text-bold text-center">
            Survey Results
          </h2>
          <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-12">
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
            <div className="w-full mt-8 flex">
              <Button variant="destructive" onClick={handleRefresh}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderCityStats(cityStats: CityStats) {
  return (
    <div className="pb-1.5">
      <h3 className="mb-4 text-lg text-bold">
        Favourite Polish cities
      </h3>
      <div className="flex flex-col gap-4">
        {cityStats.entries.map(({ value, label, count }) => (
          <div key={value} className="flex flex-row items-center gap-4">
            <div className="flex flex-col w-1/2">
              <span className="text-sm text-gray-400">{label}</span>
              <span className="text-lg text-gray-800">{count}</span>
            </div>
            <div className="w-1/2">
              <div className="bg-gray-200 h-4 rounded-full">
                <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${count * 100 / (cityStats.count)}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResultStatsFallback() {
  return (
    <div role="status" className="max-w-md pt-4 border border-gray-200 rounded shadow animate-pulse md:px-4">
      <div className="h-2.5 bg-gray-200 rounded-full w-32 mb-2.5"></div>
      <div className="flex items-baseline">
        <div className="w-full bg-gray-200 rounded-t-lg h-48"></div>
        <div className="w-full h-56 ms-6 bg-gray-200 rounded-t-lg"></div>
        <div className="w-full bg-gray-200 rounded-t-lg h-56 ms-6"></div>
        <div className="w-full h-24 ms-6 bg-gray-200 rounded-t-lg"></div>
        <div className="w-full bg-gray-200 rounded-t-lg h-36 ms-6"></div>
      </div>
      <span className="text-lg text-gray-400">Loading...</span>
    </div>
  )
}

function ResultStatsError() {
  return (
    <div role="status" className="max-w-sm pt-4 border bg-red-200 rounded shadow animate-pulse md:px-4">
      <div className="h-2.5 bg-red-400 rounded-full w-32 mb-2.5"></div>
      <div className="flex items-baseline">
        <div className="w-full bg-red-400 rounded-t-lg h-48"></div>
        <div className="w-full h-56 ms-6 bg-red-400 rounded-t-lg"></div>
        <div className="w-full bg-red-400 rounded-t-lg h-56 ms-6"></div>
        <div className="w-full h-24 ms-6 bg-red-400 rounded-t-lg"></div>
        <div className="w-full bg-red-400 rounded-t-lg h-36 ms-6"></div>
      </div>
      <span className="text-lg text-black">Error occurred while loading.</span>
    </div>
  )
}