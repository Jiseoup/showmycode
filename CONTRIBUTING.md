# Contributing to showmycode

Thanks for contributing!  
This is a quick guide to get you up and running.

Keep pull requests small — one feature or bug fix per PR.  
For larger changes, open an issue first to discuss the approach.

## Sending a pull request

1. **Fork** the repository on GitHub, then **clone** your fork and add the `upstream` remote:

   ```bash
   git clone https://github.com/<your-username>/showmycode.git
   cd showmycode
   git remote add upstream https://github.com/Jiseoup/showmycode.git
   ```

2. **Install** dependencies and set up your environment:

   ```bash
   npm install                  # also activates the git hooks
   cp .env.example .env.local   # fill in GITHUB_PAT, GITHUB_OWNER, GITHUB_REPOS (see README)
   npm run dev                  # http://localhost:3000
   ```

3. **Create a branch** with a prefix (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `i18n/`) — make your changes, then run the checks:

   ```bash
   npm run format:check   # `npm run format` to auto-fix
   npm run lint
   npm run typecheck
   npm run build
   ```

4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `i18n:`), push to your fork, and **open a PR** against `main`, filling in the PR template. PRs are squash-merged, so the PR title must follow Conventional Commits too.

## Conventions

- There's no automated test suite — verify changes manually, including dark mode and the mobile layout (down to 320px).
- Branch names and commit messages are checked locally by git hooks (set up by `npm install`) — use the prefixes above.
- Code style is enforced by Prettier and ESLint — just run the checks above.
- **i18n** — all user-facing strings must support EN/KO; add new strings to both `locales/en.json` and `locales/ko.json`.
- Be kind and respectful. See the [Code of Conduct](CODE_OF_CONDUCT.md).
