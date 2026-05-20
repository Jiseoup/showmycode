import Link from "next/link";
import Image from "next/image";
import { getPull, getPullFiles, getPullCommits } from "@/lib/github";
import { formatDate, labelStyle } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n.server";
import { FilesChangedWithTree } from "@/components/FilesChangedWithTree";
import { MarkdownBody } from "@/components/MarkdownBody";

type Tab = "overview" | "commits" | "files";

type Props = {
  params: Promise<{ lang: string; owner: string; repo: string; number: string }>;
  searchParams: Promise<{ tab?: string }>;
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
      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
        {dict.merged}
      </span>
    );
  if (state === "open")
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
        {dict.open}
      </span>
    );
  return (
    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/40 dark:text-red-300">
      {dict.closed}
    </span>
  );
}

export default async function PullDetailPage({ params, searchParams }: Props) {
  const { lang, owner, repo, number } = await params;
  const { tab: tabParam } = await searchParams;
  const prNumber = parseInt(number, 10);

  const tab: Tab = tabParam === "commits" ? "commits" : tabParam === "files" ? "files" : "overview";

  const [pr, dict] = await Promise.all([
    getPull(owner, repo, prNumber),
    getDictionary(lang as Locale),
  ]);

  // Fetch only the data needed for the active tab.
  const [files, commits] = await Promise.all([
    tab === "files" ? getPullFiles(owner, repo, prNumber) : Promise.resolve(null),
    tab === "commits" ? getPullCommits(owner, repo, prNumber) : Promise.resolve(null),
  ]);

  const baseUrl = `/${lang}/repository/${owner}/${repo}/pulls/${prNumber}`;
  const tabUrl = (t: Tab) => (t === "overview" ? baseUrl : `${baseUrl}?tab=${t}`);

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: dict.pulls.tabOverview },
    { key: "commits", label: dict.pulls.tabCommits },
    { key: "files", label: dict.pulls.tabFiles },
  ];

  return (
    <main
      className={`mx-auto w-full ${tab === "files" ? "max-w-7xl" : "max-w-4xl"} flex-1 space-y-5 overflow-auto px-6 py-6`}
    >
      {/* Back link. */}
      <Link
        href={`/${lang}/repository/${owner}/${repo}/pulls`}
        className="text-muted-foreground hover:text-foreground text-xs transition-colors"
      >
        ← {dict.pulls.backToList}
      </Link>

      {/* PR header. */}
      <div>
        <div className="flex flex-wrap items-start gap-2">
          <PRBadge merged={!!pr.merged_at} state={pr.state} dict={dict.pulls} />
          <h1 className="text-lg leading-snug font-semibold">{pr.title}</h1>
          <span className="text-muted-foreground font-normal">#{pr.number}</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Image
            src={pr.user.avatar_url}
            alt={pr.user.login}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-muted-foreground text-sm">
            {pr.user.login} · {formatDate(pr.created_at, lang)}
          </span>
          <span className="text-muted-foreground font-mono text-xs">
            {pr.head.ref} → {pr.base.ref}
          </span>
        </div>

        {pr.labels.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {pr.labels.map((l) => (
              <span
                key={l.name}
                className="gh-label rounded px-1.5 py-0.5 text-xs"
                style={labelStyle(l.color)}
              >
                {l.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tab navigation. */}
      <div className="border-border flex gap-1 border-b">
        {tabs.map(({ key, label }) => (
          <Link
            key={key}
            href={tabUrl(key)}
            className={[
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              tab === key
                ? "border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            ].join(" ")}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Overview. */}
      {tab === "overview" && (
        <div className="border-border text-foreground rounded-lg border p-4">
          {pr.body?.trim() ? (
            <MarkdownBody>{pr.body}</MarkdownBody>
          ) : (
            <span className="text-muted-foreground text-sm italic">{dict.pulls.noBody}</span>
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
      )}

      {/* Files changed */}
      {tab === "files" && files && (
        <FilesChangedWithTree files={files} diffDict={dict.pulls} treeDict={dict.pulls.tree} />
      )}
    </main>
  );
}
