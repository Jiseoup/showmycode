import Image from "next/image";
import { getPulls } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n.server";

type Props = { params: Promise<{ lang: string; owner: string; repo: string }> };

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

export default async function PullsPage({ params }: Props) {
  const { lang, owner, repo } = await params;
  const [pulls, dict] = await Promise.all([
    getPulls(owner, repo, "all"),
    getDictionary(lang as Locale),
  ]);

  return (
    <main className="flex-1 overflow-auto max-w-4xl mx-auto w-full px-6 py-6">
      <h2 className="text-lg font-semibold mb-4">
        {dict.pulls.title}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          {pulls.length}{dict.pulls.countSuffix}
        </span>
      </h2>

      {pulls.length === 0 ? (
        <p className="text-muted-foreground text-sm">{dict.pulls.empty}</p>
      ) : (
        <ul className="space-y-px">
          {pulls.map((pr) => (
            <li
              key={pr.number}
              className="flex items-start gap-3 py-4 border-b border-border last:border-0"
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
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
