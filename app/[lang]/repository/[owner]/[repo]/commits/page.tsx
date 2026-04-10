import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCommits, getRepo, getBranches } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n.server";
import { BranchSelector } from "@/components/BranchSelector";

const PER_PAGE = 50;

type Props = {
  params: Promise<{ lang: string; owner: string; repo: string }>;
  searchParams: Promise<{ page?: string; branch?: string }>;
};

export default async function CommitsPage({ params, searchParams }: Props) {
  const { lang, owner, repo } = await params;
  const { page: pageParam, branch: branchParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [repoData, branches, dict] = await Promise.all([
    getRepo(owner, repo),
    getBranches(owner, repo),
    getDictionary(lang as Locale),
  ]);

  const branchNames = branches.map((b) => b.name);
  const branch = branchNames.find((n) => n === branchParam) ?? repoData.default_branch;

  const commits = await getCommits(owner, repo, branch, PER_PAGE, page);

  const hasPrev = page > 1;
  const hasNext = commits.length === PER_PAGE;

  const pageUrl = (p: number) =>
    `/${lang}/repository/${owner}/${repo}/commits?page=${p}&branch=${encodeURIComponent(branch)}`;

  return (
    <main className="flex-1 overflow-auto max-w-4xl mx-auto w-full px-3 md:px-6 py-4 md:py-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold">
          {dict.commits.title}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {dict.commits.page} {page}
          </span>
        </h2>
        <Suspense>
          <BranchSelector branches={branchNames} current={branch} />
        </Suspense>
      </div>

      <ul className="space-y-px">
        {commits.map((c) => {
          const [title, ...bodyLines] = c.commit.message.split("\n");
          const body = bodyLines.join("\n").trim();

          return (
            <li key={c.sha} className="border-b border-border last:border-0">
              <Link
                href={`/${lang}/repository/${owner}/${repo}/commits/${c.sha}`}
                className="flex items-start gap-3 py-3 hover:bg-muted/50 transition-colors rounded px-1 -mx-1"
              >
                {c.author?.avatar_url ? (
                  <Image
                    src={c.author.avatar_url}
                    alt={c.author.login}
                    width={32}
                    height={32}
                    className="rounded-full shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted shrink-0 mt-0.5" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm leading-snug">{title}</p>
                  {body && (
                    <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line line-clamp-3">
                      {body}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {c.commit.author.name} · {formatDate(c.commit.author.date, lang)}
                  </p>
                </div>

                <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded shrink-0">
                  {c.sha.slice(0, 7)}
                </code>
              </Link>
            </li>
          );
        })}
      </ul>

      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between mt-6 gap-2 flex-wrap">
          {hasPrev ? (
            <Link
              href={pageUrl(page - 1)}
              className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted transition-colors"
            >
              ← {dict.commits.prev}
            </Link>
          ) : (
            <div />
          )}
          <span className="text-sm text-muted-foreground">
            {dict.commits.page} {page}
          </span>
          {hasNext ? (
            <Link
              href={pageUrl(page + 1)}
              className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted transition-colors"
            >
              {dict.commits.next} →
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </main>
  );
}
