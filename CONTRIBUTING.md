# Contributing to showmycode

Thanks for contributing!  
This is a quick guide to get you up and running.

## Setup

```bash
git clone https://github.com/<your-username>/showmycode.git
cd showmycode
npm install
cp .env.example .env.local   # fill in GITHUB_PAT, GITHUB_OWNER, GITHUB_REPOS (see README)
npm run dev
```

## Workflow

We follow **GitHub Flow**: branch from `main`, open a PR, squash and merge.

1. Create a branch with a prefix: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `i18n/`.
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `i18n:`).
3. Run the checks below, then open a PR against `main` and fill in the template.
4. PRs are **squash-merged** — the PR title becomes the commit on `main`, so it must follow Conventional Commits.

## Before you push

CI runs these checks automatically on every PR, but running them locally first saves a round-trip:

```bash
npm run format:check   # run `npm run format` to auto-fix
npm run lint
npm run typecheck
npm run build
```

## Conventions

- Code style is enforced automatically by Prettier and ESLint — just run the checks above.
- **i18n** — all user-facing strings must support KO/EN; add new strings to both `locales/ko.json` and `locales/en.json`.
- Be kind and respectful. See the [Code of Conduct](CODE_OF_CONDUCT.md).
