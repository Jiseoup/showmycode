# Security Policy

showmycode exists to share private code _without_ exposing credentials, so we take security reports seriously.  
Thank you for helping keep the project and its users safe.

## Supported Versions

This project follows a rolling-release model — only the latest `main` (and the current deployment built from it) receives security fixes.  
Please make sure a report reproduces against the latest `main` before submitting.

## Reporting a Vulnerability

**Please do not open a public issue, pull request, or discussion for security vulnerabilities.**  
A public report exposes the issue before a fix is available.

Instead, report privately through GitHub:

1. Go to the [**Security** tab](https://github.com/Jiseoup/showmycode/security)
   of the repository.
2. Click **Report a vulnerability** to open a private advisory.
3. Include as much detail as you can:
   - A description of the vulnerability and its impact.
   - Steps to reproduce (or a proof of concept).
   - Affected files, routes, or configuration.
   - Any suggested remediation, if you have one.

We will acknowledge your report as soon as possible.  
Once the issue is confirmed, we will work on a fix and coordinate disclosure with you.  
We will credit reporters in the advisory unless you prefer to remain anonymous.

## Scope

Issues that are especially relevant to showmycode's threat model include:

- Anything that leaks the `GITHUB_PAT` to the client or to viewers.
- Bypassing the share-token check in `proxy.ts` (token mode).
- Accessing a repository that is not in the `GITHUB_REPOS` allowlist.
- Weaknesses in the token comparison or cookie auth (`lib/auth.ts`).

Out of scope:

- Vulnerabilities that require a misconfigured deployment (e.g. a committed `.env.local`, an over-scoped PAT, or a leaked `SHARE_TOKEN`).
- Reports against dependencies that are already tracked by Dependabot, unless showmycode uses the affected code path in a way that increases the impact.
