/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  server: './server.ts',
  serverBuildPath: 'functions/[[path]].js',
  serverConditions: ['workerd', 'worker', 'browser'],
  serverDependenciesToBundle: [
    /^(?!@prisma\/client)/, // bundle all except @prisma/client
  ],
  serverMainFields: ['browser', 'module', 'main'],
  serverMinify: true,
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  tailwind: true,
  postcss: true,
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
}
