# Portfolio OS — a Windows 11 style developer portfolio

A personal portfolio for a **Java & Python developer**, presented as a Windows 11 desktop:
boot screen, lock screen, draggable windows, taskbar, Start menu, quick settings, notifications,
a working terminal, a VS Code style code viewer, File Explorer for projects, and a few easter eggs.

Built with **Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4**. No UI libraries, no image assets.

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run lint
```

## Make it yours

Everything shown in the apps comes from one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).

| What | Where |
| --- | --- |
| Name, title, location, links, bio, stats | `PORTFOLIO.name`, `title`, `location`, `email`, `whatsapp`, `github`, `linkedin` (empty = hidden), `bio`, `highlights` |
| Skills (grouped, with levels) | `PORTFOLIO.skills` |
| Projects (web / apps & games / AI / Java / Python; role, stack, highlights, links, screenshots) | `PORTFOLIO.projects` — screenshots live in `public/portfolio/` (`image`, `imageMobile`) |
| Code shown in VS Code and `cat` in Terminal | `PORTFOLIO.codeSamples` |
| Timeline / calendar marks | `PORTFOLIO.timeline` |
| Avatar | set `avatar` to an image URL, or leave empty for an initials badge |

Other knobs:

- Desktop icons, Start menu pins and taskbar pins: [`src/lib/apps.ts`](src/lib/apps.ts)
- Theme tokens, wallpapers (pure CSS gradients) and animations: [`src/app/globals.css`](src/app/globals.css)
- Accent colours and wallpaper list: `ACCENTS` / `WALLPAPERS` in [`src/lib/store.tsx`](src/lib/store.tsx)

## Apps

| App | What it does |
| --- | --- |
| Portfolio | Gallery of shipped work with desktop + mobile screenshots, role, stack, and a request-flow diagram for the AI Token Router |
| dragon5022 (About) | Bio, stats, focus cards (web, apps & games, AI, Java, Python), timeline |
| Projects / File Explorer | Virtual file system with `Projects/Web`, `Apps & Games`, `AI Tools`, `Java`, `Python`, plus `Documents` and `Code`; icon & details views, breadcrumbs, search, preview pane with screenshot |
| Skills | Grouped skill bars with tabs |
| Terminal | `help`, `about`, `skills`, `projects [java\|python]`, `project <id>`, `open <app>`, `ls/cd/cat`, `java -version`, `python --version`, `neofetch`, `theme dark\|light`, `crash` (BSOD) |
| VS Code | Tabs, explorer tree, syntax-highlighted Java / Python / Markdown |
| Contact | Form that opens your mail client, plus links |
| Guestbook | Desktop panel + dialog where visitors leave a name, star rating and message; saved on the server (see below) |
| Settings | Wallpaper, dark/light mode, accent colour, account name, system info |
| Notepad, Edge | README viewer and a new-tab page with quick links |

Lock screen: press Enter (or click Sign in) to open the desktop.

## Guestbook storage

Messages are posted to `src/app/api/guestbook/route.ts` and stored by `src/lib/guestbook-store.ts`:

- **Local / VPS**: appended to `data/guestbook.json` (git-ignored). Open that file to read or remove messages.
- **Vercel / serverless**: the filesystem is not persistent, so set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (free Upstash Redis database; see `.env.example`). Entries are kept in the Redis list `guestbook`, newest first.

The API validates input (name ≤ 40 chars, message 3–500 chars, rating 1–5), has a honeypot field and a light per-IP rate limit (3 posts / 10 min).

## Deploy

### GitHub Pages (static)

`.github/workflows/pages.yml` builds a static export on every push to `main` and publishes it to
`https://<user>.github.io/<repo>/`. One-time setup in the GitHub repo: **Settings → Pages → Source: GitHub Actions**.

The workflow sets `GITHUB_PAGES=true`, which switches `next.config.ts` to `output: "export"`, sets `basePath` to
`/<repo>` and turns off image optimization. All asset URLs go through `asset()` in `src/lib/paths.ts` so they get the prefix.

Pages is static hosting, so the guestbook API route is left out of that build. The guestbook then:

- saves messages in the visitor's own browser (localStorage) and says so in the dialog, **or**
- if the repository variable `NEXT_PUBLIC_GUESTBOOK_API` is set (Settings → Secrets and variables → Actions → Variables),
  posts to that URL instead. Point it at a Vercel deployment of this same repo, e.g. `https://your-app.vercel.app/api/guestbook`,
  and set `GUESTBOOK_ALLOWED_ORIGIN=https://<user>.github.io` there. The route already sends CORS headers.

### Vercel / any Node host (full features)

`vercel` or `next build && next start`. The guestbook API runs natively; add the Upstash variables for persistent storage.
