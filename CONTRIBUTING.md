# Contributing to showmycode

Thank you for your interest in contributing to showmycode! This guide will help you get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/showmycode.git
   cd showmycode
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in `GITHUB_PAT`, `GITHUB_OWNER`, and `GITHUB_REPOS` as described in the README.
5. **Run the dev server:**
   ```bash
   npm run dev
   ```

## Branch Naming

Create a branch from `main` using the following prefixes:

| Prefix      | Purpose                                     | Example               |
| ----------- | ------------------------------------------- | --------------------- |
| `feat/`     | New feature                                 | `feat/repo-search`    |
| `fix/`      | Bug fix                                     | `fix/dark-mode-flash` |
| `chore/`    | Config, dependencies, CI                    | `chore/upgrade-next`  |
| `refactor/` | Code restructuring                          | `refactor/github-api` |
| `docs/`     | Documentation only                          | `docs/setup-guide`    |
| `test/`     | Adding or updating tests                    | `test/api-route`      |
| `i18n/`     | Internationalization (translations, locale) | `i18n/add-ja-locale`  |

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add repository search to home page
fix: resolve syntax highlighting in dark mode
docs: update setup instructions for GitHub PAT
i18n: add Japanese locale support
```

- Use the **imperative mood** ("add", not "added")
- Keep the subject line under 72 characters
- Add a body for non-trivial changes explaining **why**

## Pull Requests

1. Ensure your branch is up to date with `main`
2. Run checks locally before pushing (see [Local Verification](#local-verification))
3. Open a PR against `main` and fill in the PR template
4. PRs are merged via **squash and merge** — the **PR title** becomes the final commit message on `main`, so it must follow Conventional Commits

### What makes a good PR

- **Small and focused** — one concern per PR
- **Descriptive title** — follows Conventional Commits format (this title is what lands on `main`)
- **Filled-in template** — explains what changed and how to verify
- **Passing CI** — build, lint, format check, and type check must pass

## Internationalization (i18n)

All user-facing strings must support both **Korean (KO)** and **English (EN)**. When adding or modifying UI text:

1. Add the string to both `locales/ko.json` and `locales/en.json`
2. Access it via the dictionary passed through server components
3. Never hardcode display text in components

## Code Conventions

The project uses automated tooling to enforce style. Run these locally and they will run again in CI on every PR.

| Tool       | Command                                   | What it does                                                                                                                   |
| ---------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Prettier   | `npm run format` / `npm run format:check` | Formats `.ts`, `.tsx`, `.js`, `.json`, `.md`, `.css`, etc. Includes Tailwind class ordering via `prettier-plugin-tailwindcss`. |
| ESLint     | `npm run lint` / `npm run lint:fix`       | Next.js core-web-vitals + TypeScript rules.                                                                                    |
| TypeScript | `npm run typecheck`                       | `tsc --noEmit` against `tsconfig.json` (strict mode).                                                                          |
| Commitlint | `npm run commitlint`                      | Validates Conventional Commits on PR titles. Allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `i18n`.        |

Additional rules:

- **TypeScript** — all code must be typed; avoid `any`. Co-locate types next to implementations (see `lib/github.ts` for the pattern).
- **Server Components by default** — only mark a component `"use client"` when interactivity is required.
- **Tailwind CSS** — use utility classes; avoid inline styles. Class order is enforced by Prettier.
- **Comments** — write all code comments in English and end them with a period (consistent with `CLAUDE.md`). This is not lint-enforced; reviewers will ask for fixes.

### git blame hygiene

Bulk reformat commits are listed in `.git-blame-ignore-revs`. To skip them in `git blame` output:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

## Local Verification

Run before pushing a PR:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

If `format:check` fails, run `npm run format` to auto-fix.

## Reporting Issues

- Use the appropriate [issue template](https://github.com/showmycode/showmycode/issues/new/choose)
- Search existing issues before opening a new one
- Include reproduction steps for bugs

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Be kind and respectful.
