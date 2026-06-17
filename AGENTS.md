<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Copilot, etc.) when working with code in this repository.

## Commands

```bash
npm run dev           # Start development server (http://localhost:3000)
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with --fix
npm run format        # Run Prettier write (includes Tailwind class sort)
npm run format:check  # Run Prettier check (fails on diff — used in CI)
npm run typecheck     # Run tsc --noEmit
```

No test framework is configured.

## Git Hooks

Native git hooks live in `.githooks/` and are activated by the `prepare` npm script (`git config core.hooksPath .githooks`), which runs automatically on `npm install`:

- `commit-msg` — rejects commits whose subject line does not start with `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, or `i18n:` (scopes like `feat(api):` are allowed)
- `pre-push` — rejects pushes of branches not named `main` or prefixed with `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, or `i18n/`

No husky/commitlint — these are plain shell scripts with zero dependencies. Hook filenames are fixed by git; keep them executable.

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:

- `GITHUB_PAT` — Fine-grained GitHub personal access token (read-only: Contents + Pull requests)
- `GITHUB_OWNER` — GitHub username/org
- `GITHUB_REPOS` — Comma-separated repository names to expose
- `SHARE_TOKEN` — Access token for the share link; leave empty to block all access
- `FILE_TREE_DEPTH` — (optional) File tree default expansion depth (`0` = all collapsed, default `0`)
- `COMMITS_PER_PAGE` — (optional) Commits per page (default `20`, max `100`)
- `PULLS_PER_PAGE` — (optional) Pull requests per page (default `10`, max `100`)

## Project Philosophy

This is an **open-source project** that accepts external contributions. All implementation decisions must follow open-source best practices:

- **Branch strategy** — GitHub Flow. Work on feature branches (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `i18n/`) and merge via PR to `main`. Enforced locally by the `pre-push` hook.
- **Commit messages** — Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `i18n:`). Enforced locally by the `commit-msg` hook.
- **PR discipline** — Squash and merge. Every PR must pass CI (format · lint · typecheck · build) and receive at least one review.
- **Code quality** — No PR without passing checks. This project intentionally has no test suite — verify changes manually.
- **Documentation** — User-facing changes should update relevant docs. Keep CONTRIBUTING.md and Issue/PR templates current.
- **i18n** — All user-facing strings must support KO/EN. Never hardcode display text. GitHub status badges that mirror API enums (`Private`/`Public`, `Merged`/`Open`/`Closed`, and file statuses `Added`/`Removed`/`Modified`/`Renamed`) are intentionally kept in English in **both** locales — treat them as fixed labels, not untranslated strings. Navigation, actions, and descriptions are localized.

The goal of showmycode is to let **anyone** securely share private GitHub repositories with specific people (e.g. interviewers, collaborators) without exposing credentials. It is not just a personal portfolio tool — it is a general-purpose solution for controlled code sharing.

## Architecture

**showmycode** is a Next.js 16 App Router application that lets users share private GitHub repositories securely — without exposing credentials to viewers.

### Routing

All pages are under `app/[lang]/` for internationalization (KO/EN). `proxy.ts` (Next.js 16's replacement for `middleware.ts`, runs on Node.js runtime) handles auth token validation and locale detection.

```
/[lang]/                                              → Repository listing
/[lang]/repository/[owner]/[repo]/                   → File tree + code viewer (?path= selects a file, ?branch= switches branch via BranchSelector)
/[lang]/repository/[owner]/[repo]/commits/           → Commit history (paginated, default 20/page; configurable via COMMITS_PER_PAGE)
/[lang]/repository/[owner]/[repo]/commits/[sha]      → Commit detail (files changed + diff)
/[lang]/repository/[owner]/[repo]/pulls/             → Pull request list (paginated, default 10/page; configurable via PULLS_PER_PAGE)
/[lang]/repository/[owner]/[repo]/pulls/[number]     → PR detail (Overview / Commits / Files changed tabs)
```

### Access Control

All pages are protected by a share token set in `SHARE_TOKEN` env var. `proxy.ts` enforces it. There are two ways to authenticate:

1. **Shared URL** — append `?token=<SHARE_TOKEN>` to any URL → `proxy.ts` validates, sets a 30-day `httpOnly` cookie (`smc_auth`), and redirects without the token in the URL.
2. **Manual entry** — the `/unauthorized` page POSTs the token to `app/api/auth/route.ts`, which sets the same cookie on success.

Subsequent visits reuse the cookie automatically. An invalid/missing token redirects to `/unauthorized` (token entry page).

If `SHARE_TOKEN` is not set, all access is blocked. The token is never exposed to the client.

Token comparison uses `crypto.timingSafeEqual` (via `lib/auth.ts`) to prevent timing attacks. The auth cookie stores an HMAC-SHA256 digest of the token — not the raw value — so a leaked cookie does not directly reveal the share token. Auth helpers (`verifyToken`, `verifyCookie`, `cookieValue`) live in `lib/auth.ts`. All token comparisons must go through this module — never use `===` for secret comparison.

Note: the `proxy.ts` matcher excludes `/api/*`, framework internals (`_next/static`, `_next/image`), and known static assets by name (`favicon.ico`, `icon.svg`) — API routes are NOT covered by the share-token check and must enforce their own auth. Currently the only API route is `/api/auth`, which is intentionally public (it is the token-entry endpoint). The matcher deliberately does NOT exclude dotted paths (`.*\..*`): repository names can contain dots (e.g. `next.js`), and a blanket dot-exclusion would let those repo pages bypass auth. If you add files to `public/`, add them to the matcher exclusion list or they will hit the auth gate.

### GitHub API Security Model

The GitHub PAT never reaches the client. All GitHub API calls happen server-side — pages are Server Components that call the typed fetch helpers in `lib/github.ts` directly:

```
Server Component → lib/github.ts → GitHub API (with PAT from env)
```

There is no client-facing GitHub proxy route; do not add one without share-token auth (`proxy.ts` does not cover `/api/*` — see Access Control). The repository layout (`app/[lang]/repository/[owner]/[repo]/layout.tsx`) validates `owner`/`repo` against the `GITHUB_REPOS` allowlist (`getAllowedRepos()`) and 404s anything else.

GitHub responses are cached for 60 seconds via `next: { revalidate: 60 }` in `ghFetch` (`lib/github.ts`) — data shown to viewers may be up to a minute stale.

### Key Patterns

- **Server Components by default** — pages use `async` components for data fetching; interactive components (`FileTree.tsx`, `LangSwitcher.tsx`, `ThemeToggle.tsx`, `FilesChanged.tsx`, `FilesChangedWithTree.tsx`, `SidebarDrawer.tsx`, `BranchSelector.tsx`) are `"use client"`
- **Mobile layout** — all pages must be usable on mobile (≥ 320px). Use `md:` breakpoint prefix for desktop-only styles. The sidebar is hidden on mobile and toggled via `SidebarDrawer.tsx`, which accepts the server-rendered `<Sidebar>` as a prop — this is the App Router pattern for mixing server and client components. Do not add new fixed-width layout elements without a responsive fallback.
- **Component exports** — components in `components/` use named exports (`export function Foo`). The export shape of Next.js file conventions is dictated by the framework: UI conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `global-error.tsx`) are resolved by their **default export**, so it is mandatory there; `route.ts` and `proxy.ts` are resolved by **named exports** (`GET`/`POST`…, and `proxy`/`config`).
- **i18n** — `lib/i18n.server.ts` loads dictionaries server-side; `lib/i18n.ts` holds types and locale config. The `/unauthorized` page lives outside `app/[lang]/`, so it has no locale param — it resolves the locale from the `Accept-Language` header (mirroring `proxy.ts`) and passes the strings to a client form. `defaultLocale` is `en`: browsers whose language is neither KO nor EN fall back to English.
- **Syntax highlighting** — `CodeViewer.tsx` uses Shiki with `github-light`/`github-dark` themes, switching based on the `dark` class on `<html>`. Line numbers are rendered via CSS counters on `.code-viewer code .line::before` in `globals.css`.
- **Markdown rendering** — `MarkdownBody.tsx` uses `react-markdown` + `remark-gfm` with custom Tailwind-styled components (no `@tailwindcss/typography`). Use this component for any user-generated Markdown content.
- **Diff view** — `FilesChanged.tsx` renders GitHub-style diffs with per-file and global fold/unfold; it accepts `GhPullFile[]` and a dict slice. `FilesChangedWithTree.tsx` wraps it with a changed-files tree sidebar for navigation, and is what the PR detail and commit detail pages actually import.
- **Loading UI** — every data-fetching route has a co-located `loading.tsx` with `animate-pulse` skeletons matching the page layout to minimize CLS.
- **Error UI** — `app/global-error.tsx` is the root error boundary; `app/[lang]/repository/[owner]/[repo]/error.tsx` catches errors within the repository view. Both are `"use client"` per the App Router convention.
- **Pagination** — implemented via `?page=N` searchParams on server components; `hasNext` is inferred from `results.length === perPage` (GitHub API does not return total count).
- **Styling** — Tailwind CSS v4 with class-based dark mode; CSS custom properties for theming; `lib/utils.ts` exports `cn()` (clsx + tailwind-merge). Use `px-3 md:px-6` (not bare `px-6`) for page-level horizontal padding.
- **shadcn/ui** — configured in `components.json` (zinc base color, `@/` aliases, no `tailwind.config.ts` — Tailwind v4 config lives in `globals.css`). When adding a new shadcn component, also add the required CSS variables (`--popover`, `--popover-foreground`, `--input`, `--ring`, etc.) to both `:root` and `.dark` in `app/globals.css`, and map them in the `@theme inline` block. The shadcn CLI may not auto-inject these variables, so verify manually.
- **Comments** — all code comments must be written in English and end with a period.
