import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepo, getAllowedRepos } from "@/lib/github";
import { BrandLink } from "@/components/BrandLink";
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
          <BrandLink locale={locale} label={owner} />
          <span className="text-muted-foreground text-base">/</span>
          <Link
            href={`/${locale}/repository/${owner}/${repo}`}
            className="truncate text-base font-semibold transition-opacity hover:opacity-80"
          >
            {repo}
          </Link>
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
