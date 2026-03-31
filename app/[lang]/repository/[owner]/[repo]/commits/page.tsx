import Image from "next/image";
import { getCommits } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n.server";

type Props = { params: Promise<{ lang: string; owner: string; repo: string }> };

export default async function CommitsPage({ params }: Props) {
  const { lang, owner, repo } = await params;
  const [commits, dict] = await Promise.all([
    getCommits(owner, repo, 50),
    getDictionary(lang as Locale),
  ]);

  return (
    <main className="flex-1 overflow-auto max-w-4xl mx-auto w-full px-6 py-6">
      <h2 className="text-lg font-semibold mb-4">
        {dict.commits.title}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          {commits.length}{dict.commits.countSuffix}
        </span>
      </h2>

      <ul className="space-y-px">
        {commits.map((c) => {
          const [title, ...bodyLines] = c.commit.message.split("\n");
          const body = bodyLines.join("\n").trim();

          return (
            <li
              key={c.sha}
              className="flex items-start gap-3 py-3 border-b border-border last:border-0"
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
            </li>
          );
        })}
      </ul>
    </main>
  );
}
