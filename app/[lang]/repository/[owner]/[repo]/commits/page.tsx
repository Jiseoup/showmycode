import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCommits, getRepo, getBranches } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n.server";
import { BranchSelector } from "@/components/BranchSelector";

const PER_PAGE = Number(process.env.COMMITS_PER_PAGE) || 50;

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
    <main className="mx-auto w-full max-w-4xl flex-1 overflow-auto px-3 py-4 md:px-6 md:py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">
          {dict.commits.title}
          <span className="text-muted-foreground ml-2 text-sm font-normal">
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
            <li key={c.sha} className="border-border border-b last:border-0">
              <Link
                href={`/${lang}/repository/${owner}/${repo}/commits/${c.sha}`}
                className="hover:bg-muted/50 -mx-1 flex items-start gap-3 rounded px-1 py-3 transition-colors"
              >
                {c.author?.avatar_url ? (
                  <Image
                    src={c.author.avatar_url}
                    alt={c.author.login}
                    width={32}
                    height={32}
                    className="mt-0.5 shrink-0 rounded-full"
                  />
                ) : (
                  <div className="bg-muted mt-0.5 h-8 w-8 shrink-0 rounded-full" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug font-medium">{title}</p>
                  {body && (
                    <p className="text-muted-foreground mt-1 line-clamp-3 text-xs whitespace-pre-line">
                      {body}
                    </p>
                  )}
                  <p className="text-muted-foreground mt-1 text-xs">
                    {c.commit.author.name} · {formatDate(c.commit.author.date, lang)}
                  </p>
                </div>

                <code className="text-muted-foreground bg-muted shrink-0 rounded px-2 py-1 font-mono text-xs">
                  {c.sha.slice(0, 7)}
                </code>
              </Link>
            </li>
          );
        })}
      </ul>

      {(hasPrev || hasNext) && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          {hasPrev ? (
            <Link
              href={pageUrl(page - 1)}
              className="border-border hover:bg-muted rounded border px-3 py-1.5 text-sm transition-colors"
            >
              ← {dict.commits.prev}
            </Link>
          ) : (
            <div />
          )}
          <span className="text-muted-foreground text-sm">
            {dict.commits.page} {page}
          </span>
          {hasNext ? (
            <Link
              href={pageUrl(page + 1)}
              className="border-border hover:bg-muted rounded border px-3 py-1.5 text-sm transition-colors"
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
