import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepo, getAllowedRepos } from "@/lib/github";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangSwitcher } from "@/components/LangSwitcher";
import { getDictionary, type Locale } from "@/lib/i18n.server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string; owner: string; repo: string }>;
};

export default async function RepoLayout({ children, params }: Props) {
  const { lang, owner, repo } = await params;
  const locale = lang as Locale;

  // Guard: reject any repo not in the allowlist before fetching or rendering anything.
  const allowed = getAllowedRepos().some((r) => r.owner === owner && r.repo === repo);
  if (!allowed) notFound();

  const [repoData, dict] = await Promise.all([getRepo(owner, repo), getDictionary(locale)]);

  const tabs = [
    { label: dict.nav.code, href: `/${locale}/repository/${owner}/${repo}` },
    { label: dict.nav.commits, href: `/${locale}/repository/${owner}/${repo}/commits` },
    { label: dict.nav.pulls, href: `/${locale}/repository/${owner}/${repo}/pulls` },
  ];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border flex items-center justify-between gap-2 border-b px-3 py-3 md:gap-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <Link
            href={`/${locale}`}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            <svg viewBox="0 0 16 16" className="h-5 w-5 fill-current" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href={`/${locale}`}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            {owner}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="truncate text-sm font-semibold">{repo}</span>
          <span className="border-border text-muted-foreground shrink-0 rounded-full border px-2 py-0.5 text-xs">
            {repoData.private ? dict.repo.private : dict.repo.public}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LangSwitcher currentLang={locale} />
          <ThemeToggle />
        </div>
      </header>

      <nav className="border-border border-b px-3 md:px-6">
        <ul className="flex gap-1">
          {tabs.map((tab) => (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className="text-muted-foreground hover:text-foreground hover:border-foreground/30 inline-block border-b-2 border-transparent px-3 py-2.5 text-sm transition-colors"
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
