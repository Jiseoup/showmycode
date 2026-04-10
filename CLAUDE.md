# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js Version

This project uses a recent version of Next.js with breaking changes. Before writing any code, read the relevant guide in `node_modules/next/dist/docs/` — APIs, conventions, and file structure may differ from training data. Heed deprecation notices.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:
- `GITHUB_PAT` — Fine-grained GitHub personal access token (read-only: Contents + Pull requests)
- `GITHUB_OWNER` — GitHub username/org
- `GITHUB_REPOS` — Comma-separated repository names to expose

## Project Philosophy

This is an **open-source project** that accepts external contributions. All implementation decisions must follow open-source best practices:

- **Branch strategy** — GitHub Flow. Work on feature branches (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `test/`, `i18n/`) and merge via PR to `main`.
- **Commit messages** — Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `i18n:`).
- **PR discipline** — Squash and merge. Every PR must pass CI (build + lint + test) and receive at least one review.
- **Code quality** — No PR without passing checks. Add tests for new features when a test framework is in place.
- **Documentation** — User-facing changes should update relevant docs. Keep CONTRIBUTING.md and Issue/PR templates current.
- **i18n** — All user-facing strings must support KO/EN. Never hardcode display text.

The goal of showmycode is to let **anyone** securely share private GitHub repositories with specific people (e.g. interviewers, collaborators) without exposing credentials. It is not just a personal portfolio tool — it is a general-purpose solution for controlled code sharing.

## Architecture

**showmycode** is a Next.js 16 App Router application that lets users share private GitHub repositories securely — without exposing credentials to viewers.

### Routing

All pages are under `app/[lang]/` for internationalization (KO/EN). `proxy.ts` (Next.js 16's replacement for `middleware.ts`, runs on Node.js runtime) handles auth token validation and locale detection.

```
/[lang]/                                              → Repository listing
/[lang]/repository/[owner]/[repo]/                   → File tree + code viewer
/[lang]/repository/[owner]/[repo]/commits/           → Commit history (paginated, 50/page)
/[lang]/repository/[owner]/[repo]/commits/[sha]      → Commit detail (files changed + diff)
/[lang]/repository/[owner]/[repo]/pulls/             → Pull request list (paginated, 30/page)
/[lang]/repository/[owner]/[repo]/pulls/[number]     → PR detail (Overview / Commits / Files changed tabs)
```

### Access Control

All pages are protected by a share token set in `SHARE_TOKEN` env var. The flow:

1. First visit: append `?token=<SHARE_TOKEN>` to any URL → middleware validates, sets a 30-day `httpOnly` cookie, redirects without the token in the URL.
2. Subsequent visits: cookie is checked automatically.
3. Invalid/missing token → redirected to `/unauthorized` (token entry page).

If `SHARE_TOKEN` is not set, all access is blocked. The token is never exposed to the client.

### GitHub API Security Model

The GitHub PAT never reaches the client. All GitHub API calls go through a server-side proxy:

```
Client → /api/github/[...path] → GitHub API (with PAT from env)
```

The API route (`app/api/github/[...path]/route.ts`) validates that requested repos are in the `GITHUB_REPOS` allowlist before proxying.

`lib/github.ts` provides typed fetch helpers used by server components and the API route.

### Key Patterns

- **Server Components by default** — pages use `async` components for data fetching; interactive components (`FileTree.tsx`, `LangSwitcher.tsx`, `ThemeToggle.tsx`, `FilesChanged.tsx`, `SidebarDrawer.tsx`) are `"use client"`
- **Mobile layout** — all pages must be usable on mobile (≥ 320px). Use `md:` breakpoint prefix for desktop-only styles. The sidebar is hidden on mobile and toggled via `SidebarDrawer.tsx`, which accepts the server-rendered `<Sidebar>` as a prop — this is the App Router pattern for mixing server and client components. Do not add new fixed-width layout elements without a responsive fallback.
- **i18n** — `lib/i18n.server.ts` loads dictionaries server-side; `lib/i18n.ts` holds types and locale config
- **Syntax highlighting** — `CodeViewer.tsx` uses Shiki with `github-light`/`github-dark` themes, switching based on the `dark` class on `<html>`
- **Markdown rendering** — `MarkdownBody.tsx` uses `react-markdown` + `remark-gfm` with custom Tailwind-styled components (no `@tailwindcss/typography`). Use this component for any user-generated Markdown content.
- **Diff view** — `FilesChanged.tsx` renders GitHub-style diffs with per-file and global fold/unfold. Accepts `GhPullFile[]` and a dict slice; reused across PR detail and commit detail pages.
- **Pagination** — implemented via `?page=N` searchParams on server components; `hasNext` is inferred from `results.length === perPage` (GitHub API does not return total count).
- **Styling** — Tailwind CSS v4 with class-based dark mode; CSS custom properties for theming; `lib/utils.ts` exports `cn()` (clsx + tailwind-merge). Use `px-3 md:px-6` (not bare `px-6`) for page-level horizontal padding.
- **shadcn/ui** — configured in `components.json` (zinc base color, `@/` aliases)
- **Comments** — all code comments must be written in English and end with a period.
