import type { MetaFunction } from '@remix-run/cloudflare'
import { NavLink } from '@remix-run/react'
import { Button } from '~/components/ui/button'

const description = `
Embark on an interactive journey with Alberto, as he explores React development using Remix, Edge deployments via Cloudflare Pages, and serverless data storage with Neon. You will learn the key advantages of Edge computing runtime platforms, and how to adapt your Remix apps for them.
Moreover, you will see how to query a Neon database using the familiar and type-safe Prisma ORM.
Finally, you will gain practical insights about the nuances and caveats of Edge platforms, as Alberto shares firsthand experiences from making the Prisma internals compatible with this innovative computing stack. Are you ready for the future?
`

export const meta: MetaFunction = () => {
  return [
    { title: 'Demo: Interactive web apps at the Edge with Remix, Neon, and Prisma' },
    { name: 'description', content: description },
  ]
}

export default function Index() {
  return (
    <div className="bg-white h-full rounded-md shadow-md">
      <div className="max-w-screen-xl h-full flex flex-col flex-wrap items-center justify-center mx-auto gap-4 drop-shadow-sm">
        <h1 className="self-center text-2xl font-semibold whitespace-nowrap">Survey Demo</h1>
        <div className="w-full md:block md:w-auto">
          <ul className="font-medium justify-center flex-col flex p-4 md:p-0 gap-2">
            <li>
              <IndexLink to="/survey/join" >Join Survey</IndexLink>
            </li>
            <li>
              <IndexLink to="/survey/results" >View Results</IndexLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function IndexLink({
  to,
  children
}: {
  to: string
  children: React.ReactNode
}) {
  return <Button className="w-full bg-sapphire-500 hover:bg-sapphire-600" size="lg" asChild>
    <NavLink to={to}>
      {children}
    </NavLink>
  </Button>
}