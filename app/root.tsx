import type { LinksFunction } from '@remix-run/cloudflare'
import { cssBundleHref } from '@remix-run/css-bundle'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { Toaster } from '~/components/ui/toaster'
import styles from './tailwind.css'
import { ReactNode } from 'react'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          httpEquiv="Content-Type"
          content="text/html;charset=utf-8"
        />
        {/* All meta exports on all routes will go here */}
        <Meta />

        {/* All link exports on all routes will go here */}
        <Links />
      </head>
      <body className='bg-neutral-400'>
        {/* Child routes go here */}
        <Layout>
          <Outlet />
        </Layout>
        {/* Manages scroll position for client-side transitions */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <ScrollRestoration />

        {/* Script tags go here */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <Scripts />

        {/* Sets up automatic reload when you change code */}
        {/* and only does anything during development */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <LiveReload />
      </body>
    </html>
  )
}

const repositoryUrl = 'https://github.com/jkomyno/kongres-nextjs-2024'

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-lvh flex flex-col justify-between">
      <main className="lg:px-24 sm:p-12 p-4 flex-grow">
        {children}
        <Toaster />
      </main>
      <footer className="lg:px-24 sm:px-12 px-4 py-4 bg-white">
        <div className="px-4 text-sm">
          Check this on <Link className="text-primary underline-offset-4 hover:underline" to={repositoryUrl} target="_blank" rel="noreferrer">Github (@jkomyno)</Link>.
        </div>
      </footer>
    </div>
  )
}
