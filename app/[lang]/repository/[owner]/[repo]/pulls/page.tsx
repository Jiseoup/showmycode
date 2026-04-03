import Link from "next/link";
import Image from "next/image";
import { getPulls } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n.server";

const PER_PAGE = 30;

type Props = {
  params: Promise<{ lang: string; owner: string; repo: string }>;
  searchParams: Promise<{ page?: string }>;
};

function PRBadge({ merged, state, dict }: {
  merged: boolean;
  state: string;
  dict: { merged: string; open: string; closed: string };
}) {
  if (merged)
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-medium shrink-0">
        {dict.merged}
      </span>
    );
  if (state === "open")
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-medium shrink-0">
        {dict.open}
      </span>
    );
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 font-medium shrink-0">
      {dict.closed}
    </span>
  );
}

export default async function PullsPage({ params, searchParams }: Props) {
  const { lang, owner, repo } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [pulls, dict] = await Promise.all([
    getPulls(owner, repo, "all", PER_PAGE, page),
    getDictionary(lang as Locale),
  ]);

  const hasPrev = page > 1;
  const hasNext = pulls.length === PER_PAGE;

  const pageUrl = (p: number) =>
    `/${lang}/repository/${owner}/${repo}/pulls?page=${p}`;

  return (
    <main className="flex-1 overflow-auto max-w-4xl mx-auto w-full px-6 py-6">
      <h2 className="text-lg font-semibold mb-4">
        {dict.pulls.title}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          {dict.pulls.page} {page}
        </span>
      </h2>

      {pulls.length === 0 ? (
        <p className="text-muted-foreground text-sm">{dict.pulls.empty}</p>
      ) : (
        <ul className="space-y-px">
          {pulls.map((pr) => (
            <li key={pr.number} className="border-b border-border last:border-0">
              <Link
                href={`/${lang}/repository/${owner}/${repo}/pulls/${pr.number}`}
                className="flex items-start gap-3 py-4 hover:bg-muted/50 transition-colors rounded px-1 -mx-1"
              >
                <Image
                  src={pr.user.avatar_url}
                  alt={pr.user.login}
                  width={32}
                  height={32}
                  className="rounded-full shrink-0 mt-0.5"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <PRBadge merged={!!pr.merged_at} state={pr.state} dict={dict.pulls} />
                    <p className="font-medium text-sm">{pr.title}</p>
                    <span className="text-xs text-muted-foreground">#{pr.number}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {pr.head.ref} → {pr.base.ref}
                  </p>

                  {pr.body && (
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                      {pr.body}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                      {pr.user.login} · {formatDate(pr.created_at, lang)}
                    </span>
                    {pr.labels.map((l) => {
                      const safeColor = /^[0-9a-fA-F]{6}$/.test(l.color) ? l.color : "8b949e";
                      return (
                        <span
                          key={l.name}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: `#${safeColor}33`,
                            color: `#${safeColor}`,
                            border: `1px solid #${safeColor}55`,
                          }}
                        >
                          {l.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between mt-6">
          {hasPrev ? (
            <Link
              href={pageUrl(page - 1)}
              className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted transition-colors"
            >
              ← {dict.pulls.prev}
            </Link>
          ) : (
            <div />
          )}
          <span className="text-sm text-muted-foreground">
            {dict.pulls.page} {page}
          </span>
          {hasNext ? (
            <Link
              href={pageUrl(page + 1)}
              className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted transition-colors"
            >
              {dict.pulls.next} →
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </main>
  );
}
