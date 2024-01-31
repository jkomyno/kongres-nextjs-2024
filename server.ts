import { logDevReady } from '@remix-run/cloudflare'
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages'
import * as build from '@remix-run/dev/server-build'

export type AppEnv = {
  DATABASE_URL: string,
}

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    env: AppEnv,
  }
}

if (build.mode === 'development') {
  logDevReady(build)
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    const { env } = context

    if (validateEnv(env)) {
      return { env }
    }
    
    console.log(env)
    throw new Error(`[server] Missing environment variables`)
  },
  mode: build.mode,
})

function validateEnv(env?: Record<string, unknown>): env is AppEnv {
  return !!env && 'DATABASE_URL' in env && typeof env.DATABASE_URL === 'string'
}
