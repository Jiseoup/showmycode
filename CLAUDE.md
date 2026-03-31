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

## Architecture

**showmycode** is a Next.js 16 App Router application that serves as a secure portfolio viewer for GitHub repositories — allowing users to share private code with interviewers without exposing credentials.

### Routing

All pages are under `app/[lang]/` for internationalization (KO/EN). The proxy (Next.js 16 middleware) in `proxy.ts` detects `Accept-Language` and redirects to the appropriate locale.

```
/[lang]/                                    → Repository listing
/[lang]/repository/[owner]/[repo]/          → File tree + code viewer
/[lang]/repository/[owner]/[repo]/commits/  → Commit history
/[lang]/repository/[owner]/[repo]/pulls/    → Pull requests
```

### GitHub API Security Model

The GitHub PAT never reaches the client. All GitHub API calls go through a server-side proxy:

```
Client → /api/github/[...path] → GitHub API (with PAT from env)
```

The API route (`app/api/github/[...path]/route.ts`) validates that requested repos are in the `GITHUB_REPOS` allowlist before proxying.

`lib/github.ts` provides typed fetch helpers used by server components and the API route.

### Key Patterns

- **Server Components by default** — pages use `async` components for data fetching; interactive components (`FileTree.tsx`, `LangSwitcher.tsx`, `ThemeToggle.tsx`) are `"use client"`
- **i18n** — `lib/i18n.server.ts` loads dictionaries server-side; `lib/i18n.ts` holds types and locale config
- **Syntax highlighting** — `CodeViewer.tsx` uses Shiki with `github-light`/`github-dark` themes, switching based on the `dark` class on `<html>`
- **Styling** — Tailwind CSS v4 with class-based dark mode; CSS custom properties for theming; `lib/utils.ts` exports `cn()` (clsx + tailwind-merge)
- **shadcn/ui** — configured in `components.json` (zinc base color, `@/` aliases)
