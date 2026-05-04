import Link from "next/link";
import Image from "next/image";
import { getPulls } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n.server";

const PER_PAGE = Number(process.env.PULLS_PER_PAGE) || 30;

type Props = {
  params: Promise<{ lang: string; owner: string; repo: string }>;
  searchParams: Promise<{ page?: string }>;
};

function PRBadge({
  merged,
  state,
  dict,
}: {
  merged: boolean;
  state: string;
  dict: { merged: string; open: string; closed: string };
}) {
  if (merged)
    return (
      <span className="shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
        {dict.merged}
      </span>
    );
  if (state === "open")
    return (
      <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
        {dict.open}
      </span>
    );
  return (
    <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/40 dark:text-red-300">
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

  const pageUrl = (p: number) => `/${lang}/repository/${owner}/${repo}/pulls?page=${p}`;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 overflow-auto px-3 py-4 md:px-6 md:py-6">
      <h2 className="mb-4 text-lg font-semibold">
        {dict.pulls.title}
        <span className="text-muted-foreground ml-2 text-sm font-normal">
          {dict.pulls.page} {page}
        </span>
      </h2>

      {pulls.length === 0 ? (
        <p className="text-muted-foreground text-sm">{dict.pulls.empty}</p>
      ) : (
        <ul className="space-y-px">
          {pulls.map((pr) => (
            <li key={pr.number} className="border-border border-b last:border-0">
              <Link
                href={`/${lang}/repository/${owner}/${repo}/pulls/${pr.number}`}
                className="hover:bg-muted/50 -mx-1 flex items-start gap-3 rounded px-1 py-4 transition-colors"
              >
                <Image
                  src={pr.user.avatar_url}
                  alt={pr.user.login}
                  width={32}
                  height={32}
                  className="mt-0.5 shrink-0 rounded-full"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <PRBadge merged={!!pr.merged_at} state={pr.state} dict={dict.pulls} />
                    <p className="text-sm font-medium">{pr.title}</p>
                    <span className="text-muted-foreground text-xs">#{pr.number}</span>
                  </div>

                  <p className="text-muted-foreground mt-1 truncate font-mono text-xs">
                    {pr.head.ref} → {pr.base.ref}
                  </p>

                  {pr.body && (
                    <p className="text-muted-foreground mt-1.5 line-clamp-2 text-xs">{pr.body}</p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {pr.user.login} · {formatDate(pr.created_at, lang)}
                    </span>
                    {pr.labels.map((l) => {
                      const safeColor = /^[0-9a-fA-F]{6}$/.test(l.color) ? l.color : "8b949e";
                      return (
                        <span
                          key={l.name}
                          className="rounded px-1.5 py-0.5 text-xs"
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
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          {hasPrev ? (
            <Link
              href={pageUrl(page - 1)}
              className="border-border hover:bg-muted rounded border px-3 py-1.5 text-sm transition-colors"
            >
              ← {dict.pulls.prev}
            </Link>
          ) : (
            <div />
          )}
          <span className="text-muted-foreground text-sm">
            {dict.pulls.page} {page}
          </span>
          {hasNext ? (
            <Link
              href={pageUrl(page + 1)}
              className="border-border hover:bg-muted rounded border px-3 py-1.5 text-sm transition-colors"
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
