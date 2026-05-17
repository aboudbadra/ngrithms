# ngrithms

Umbrella site for the [@ngrithms](https://www.npmjs.com/org/ngrithms) family of Angular libraries — landing page, per-library demos, and docs.

Built with [Analog](https://analogjs.org) (file-based routing, prerendered to static HTML), deployed to Cloudflare Pages.

## Local development

```bash
npm install
npm run dev    # http://localhost:5173
```

## Build

```bash
npm run build   # output: dist/analog/public  (fully static, ready for Cloudflare Pages)
```

## Adding a library page

1. Create `src/app/pages/<lib-name>.page.ts` (file name = route path).
2. Add the route to the `prerender.routes` array in `vite.config.ts` so it ships in the static build.
3. Add a card linking to it on the home page (`src/app/pages/index.page.ts`).

## Cloudflare Pages settings

- Build command: `npm run build`
- Build output directory: `dist/analog/public`
- Node version: `22` (set `NODE_VERSION=22` as an environment variable)

## License

MIT
