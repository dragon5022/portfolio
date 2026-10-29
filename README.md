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
| Name, title, location, links, bio, stats | `PORTFOLIO.name`, `title`, `location`, `email`, `github`, `linkedin` (empty = hidden), `bio`, `highlights` |
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
| Portfolio | Gallery of shipped work: desktop + mobile screenshots of live sites and apps, workflow diagrams for backend systems (`src/data/flows.ts`), role, stack and a link to the live site |
| dragon5022 (About) | Bio, stats, focus cards (web, apps & games, AI, Java, Python), timeline |
| Projects / File Explorer | Virtual file system with `Projects/Web`, `Apps & Games`, `AI Tools`, `Java`, `Python`, plus `Documents` and `Code`; icon & details views, breadcrumbs, search, preview pane with screenshot |
| Skills | Grouped skill bars with tabs |
| Terminal | `help`, `about`, `skills`, `projects [java\|python]`, `project <id>`, `open <app>`, `whoami` (visitor's GitHub profile), `repos [user]` (public GitHub repos), `ls/cd/cat`, `java -version`, `python --version`, `neofetch`, `theme dark\|light`, `crash` (BSOD) |
| VS Code | Tabs, explorer tree, syntax-highlighted Java / Python / Markdown |
| Contact | Form that opens your mail client, plus links |
| Guestbook | Desktop panel + dialog where visitors leave a name (pre-filled from GitHub), star rating and message; saved on the server (see below) |
| Settings | Wallpaper, dark/light mode, accent colour, the visitor's GitHub account (profile, stats, recent repos), system info |
| Notepad, Edge | README viewer and a new-tab page with quick links |

Lock screen: visitors sign in with their GitHub username. It is checked against the public GitHub API
(`src/lib/github.ts`, no token needed); unknown usernames are rejected. If GitHub cannot be reached or its
rate limit (60 lookups/hour per visitor) is hit, the visitor is let in with just the username. The profile
is kept in memory only, so each visit asks again. It shows in the Start menu, Settings → Accounts and Terminal.

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

Pages is static hosting, so the guestbook API route is left out of that build. To make visitor messages shared
(visible to everyone, readable by you), give the static site a database:

**Supabase (recommended, free)**
1. Create a project at https://supabase.com (free tier).
2. In the project: **SQL Editor → New query**, paste the contents of `supabase/guestbook.sql`, click **Run**.
3. Copy the **Project URL** (`https://<project-ref>.supabase.co`) and, from **Project Settings → API Keys**, the
   **publishable** key (or the legacy **anon** key; either works).
4. In the GitHub repo: **Settings → Secrets and variables → Actions → Variables → New repository variable**, add
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Push any commit (or re-run the workflow). Messages now go to the `guestbook` table; read or delete them in
   Supabase **Table Editor**.

The anon key is safe to publish: visitors can only read messages and insert the name, rating and message
columns (never edit, delete, or set the date), and a flood guard allows at most 5 new messages a minute and
30 an hour. Changed `supabase/guestbook.sql`? Run it again; it is safe to re-run.

Free Supabase projects are paused after a week without activity; if the guestbook stops loading, restore the
project from the Supabase dashboard.

**Alternatives**: set `NEXT_PUBLIC_GUESTBOOK_API` to a Vercel deployment of this repo
(`https://your-app.vercel.app/api/guestbook`, with `GUESTBOOK_ALLOWED_ORIGIN=https://<user>.github.io` there),
or leave everything unset and messages are kept only in each visitor's browser.

### Vercel / any Node host (full features)

`vercel` or `next build && next start`. The guestbook API runs natively; add the Upstash variables for persistent storage.
