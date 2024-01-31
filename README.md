# Underrated gems of Rust & WebAssembly: Errors · Async · I/O

---

Slides for this talk are also available [here](https://jkomyno-kongres-nextjs-2024.vercel.app/).

## Abstract

Embark on an interactive journey with Alberto, as he explores React development using Remix, Edge deployments via Cloudflare Pages, and serverless data storage with Neon. You will learn the key advantages of Edge computing runtime platforms, and how to adapt your Remix apps for them.

Moreover, you will see how to query a Neon database using the familiar and type-safe Prisma ORM.

Finally, you will gain practical insights about the nuances and caveats of Edge platforms, as Alberto shares firsthand experiences from making the Prisma internals compatible with this innovative computing stack. Are you ready for the future?

## About

This repository contains the source code for a simple survey web app.
It's built with:
- [React.js framework]: [Remix](https://remix.run)
- [Data access tool]: [Prisma](https://prisma.io)
- [Database]: [Neon](https://neon.tech).
- [Deployment platform]: [Cloudflare Pages](https://pages.cloudflare.com)

## Requirements

- [Node.js 20.9.0](https://nodejs.org/en) or superior*
- [pnpm 8.9.2](https://pnpm.io/installation) or superior*

(*) These are the versions used to develop this repository. Older versions might work as well, but they haven't been tested.

## Database Setup: Neon

To create a new Neon database setup:

- Create a new [Neon account](https://neon.tech), if you don't have one already.
- Navigate to https://console.neon.tech/app/projects.
- Click "Create new project". For example, call the project "edge-prisma" and the database "talks".
- Copy the connection string from the "Database" tab. It should look like this:
  ```
  postgresql://jkomyno:...-pooler.eu-central-1.aws.neon.tech/talks?sslmode=require&pgbouncer=true
  ```
- Rename `.dev.vars.example` into `.dev.vars`, and replace the `DATABASE_URL` value with the connection string you just copied.

> [!TIP]
> Cloudflare's CLI tool, Wrangler, reads `.dev.vars` file instead of a `.env` file.
> Prisma, instead, by default reads `.env` files.
> Rather than having two different files with the same database credentials, you can use a single one, as long as you run each `prisma` command prefixed by `pnpm run env --`.

## Development

- Install the dependencies via:
  ```sh
  pnpm i
  ```

- Write the [database schema](./prisma/schema.prisma) to the database via:
  ```sh
  pnpm run env -- pnpm prisma db push
  ```

- Seed the database via:
  ```sh
  pnpm run env -- pnpm prisma db seed
  ```
  You only need to do this once.

- Emulate the Cloudflare runtime locally via:
  ```sh
  pnpm dev
  ```

  This will spin up a Remix dev server and a Wrangler dev server.
  Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready to go!

## Deployment

Cloudflare Pages are currently only deployable through their Git provider integrations.

If you don't already have an account, then [create a Cloudflare account here](https://dash.cloudflare.com/sign-up/pages) and after verifying your email address with Cloudflare, go to your dashboard and follow the [Cloudflare Pages deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything).

Configure the "Build command" should be set to `npm run build`, and the "Build output directory" should be set to `public`.

## 👤 Author

**Alberto Schiabel**

* Twitter: [@jkomyno](https://twitter.com/jkomyno)
* Github: [@jkomyno](https://github.com/jkomyno)

Please consider supporting my work by following me on Twitter and starring my projects on GitHub.
I mostly post about TypeScript, Rust, and WebAssembly. Thanks!

## 📝 License

Built with ❤️ by [Alberto Schiabel](https://github.com/jkomyno).
This project is [MIT](https://github.com/jkomyno/kongres-nextjs-2024/blob/main/LICENSE) licensed.
