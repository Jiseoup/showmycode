// Resolves the public origin of this deployment.
//
// showmycode is self-hosted, so the origin cannot be hard-coded: every fork
// serves from a different domain. Prefer an explicit SITE_URL, then fall
// back to the production domain Vercel injects, then to localhost for `next dev`.
function resolveSiteUrl(): string {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

// Absolute URL for a path, for metadata fields that require one.
export const absoluteUrl = (path: string): string => `${siteUrl}${path}`;

// Whether this deployment opts in to search engine indexing.
//
// Off by default, mirroring ENABLE_ANALYTICS. showmycode exists to share private
// repositories: an instance running in public mode would otherwise let crawlers
// index the repository names it serves, and the code behind them. The demo site
// turns this on; a self-hosted instance almost never wants it.
export const seoEnabled = process.env.ENABLE_SEO === "true";
