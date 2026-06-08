import { getAllowedRepos, getRepo } from "@/lib/github";
import { RepoCard } from "@/components/RepoCard";
import { BrandLink } from "@/components/BrandLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangSwitcher } from "@/components/LangSwitcher";
import { getDictionary, type Locale } from "@/lib/i18n.server";

const OWNER = process.env.GITHUB_OWNER!;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const [repos] = await Promise.all([
    Promise.all(getAllowedRepos().map(({ owner, repo }) => getRepo(owner, repo))),
  ]);
  const dict = await getDictionary(locale);

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border flex items-center justify-between gap-2 border-b px-3 py-3 md:gap-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <BrandLink locale={locale} label={OWNER} />
        </div>
        <div className="flex items-center gap-3">
          <LangSwitcher currentLang={locale} />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 py-6 md:px-6 md:py-10">
        <ul className="space-y-3">
          {repos.map((repo) => (
            <li key={repo.full_name}>
              <RepoCard repo={repo} lang={locale} dict={dict.repo} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
