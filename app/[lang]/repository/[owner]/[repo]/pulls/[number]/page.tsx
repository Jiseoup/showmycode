import Link from "next/link";
import Image from "next/image";
import { getPull, getPullFiles, getPullCommits } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n.server";
import { FilesChanged } from "@/components/FilesChanged";
import { MarkdownBody } from "@/components/MarkdownBody";

type Tab = "overview" | "commits" | "files";

type Props = {
  params: Promise<{ lang: string; owner: string; repo: string; number: string }>;
  searchParams: Promise<{ tab?: string }>;
};

function PRBadge({ merged, state, dict }: {
  merged: boolean;
  state: string;
  dict: { merged: string; open: string; closed: string };
}) {
  if (merged)
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-medium">
        {dict.merged}
      </span>
    );
  if (state === "open")
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-medium">
        {dict.open}
      </span>
    );
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 font-medium">
      {dict.closed}
    </span>
  );
}


export default async function PullDetailPage({ params, searchParams }: Props) {
  const { lang, owner, repo, number } = await params;
  const { tab: tabParam } = await searchParams;
  const prNumber = parseInt(number, 10);

  const tab: Tab =
    tabParam === "commits" ? "commits"
    : tabParam === "files" ? "files"
    : "overview";

  const [pr, dict] = await Promise.all([
    getPull(owner, repo, prNumber),
    getDictionary(lang as Locale),
  ]);

  // 탭에 따라 필요한 데이터만 패치
  const [files, commits] = await Promise.all([
    tab === "files" ? getPullFiles(owner, repo, prNumber) : Promise.resolve(null),
    tab === "commits" ? getPullCommits(owner, repo, prNumber) : Promise.resolve(null),
  ]);

  const baseUrl = `/${lang}/repository/${owner}/${repo}/pulls/${prNumber}`;
  const tabUrl = (t: Tab) => t === "overview" ? baseUrl : `${baseUrl}?tab=${t}`;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: dict.pulls.tabOverview },
    { key: "commits",  label: dict.pulls.tabCommits },
    { key: "files",    label: dict.pulls.tabFiles },
  ];

  return (
    <main className="flex-1 overflow-auto max-w-4xl mx-auto w-full px-6 py-6 space-y-5">
      {/* 뒤로가기 */}
      <Link
        href={`/${lang}/repository/${owner}/${repo}/pulls`}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ← {dict.pulls.backToList}
      </Link>

      {/* PR 헤더 */}
      <div>
        <div className="flex items-start gap-2 flex-wrap">
          <PRBadge merged={!!pr.merged_at} state={pr.state} dict={dict.pulls} />
          <h1 className="text-lg font-semibold leading-snug">{pr.title}</h1>
          <span className="text-muted-foreground font-normal">#{pr.number}</span>
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Image
            src={pr.user.avatar_url}
            alt={pr.user.login}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-sm text-muted-foreground">
            {pr.user.login} · {formatDate(pr.created_at, lang)}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            {pr.head.ref} → {pr.base.ref}
          </span>
        </div>

        {pr.labels.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
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
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(({ key, label }) => (
          <Link
            key={key}
            href={tabUrl(key)}
            className={[
              "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="border border-border rounded-lg p-4 text-foreground">
          {pr.body?.trim() ? (
            <MarkdownBody>{pr.body}</MarkdownBody>
          ) : (
            <span className="text-sm text-muted-foreground italic">{dict.pulls.noBody}</span>
          )}
        </div>
      )}

      {/* Commits */}
      {tab === "commits" && commits && (
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
      )}

      {/* Files changed */}
      {tab === "files" && files && (
        <FilesChanged files={files} dict={dict.pulls} />
      )}
    </main>
  );
}
