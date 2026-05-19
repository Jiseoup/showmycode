import Link from "next/link";
import Image from "next/image";
import { getCommit } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n.server";
import { FilesChangedWithTree } from "@/components/FilesChangedWithTree";

type Props = {
  params: Promise<{ lang: string; owner: string; repo: string; sha: string }>;
};

export default async function CommitDetailPage({ params }: Props) {
  const { lang, owner, repo, sha } = await params;

  const [commit, dict] = await Promise.all([
    getCommit(owner, repo, sha),
    getDictionary(lang as Locale),
  ]);

  const [title, ...bodyLines] = commit.commit.message.split("\n");
  const body = bodyLines.join("\n").trim();

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 overflow-auto px-6 py-6">
      <Link
        href={`/${lang}/repository/${owner}/${repo}/commits`}
        className="text-muted-foreground hover:text-foreground text-xs transition-colors"
      >
        ← {dict.commits.backToList}
      </Link>

      {/* Commit header. */}
      <div className="border-border space-y-3 rounded-lg border p-4">
        <div>
          <p className="text-base leading-snug font-semibold">{title}</p>
          {body && <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">{body}</p>}
        </div>

        <div className="border-border flex flex-wrap items-center gap-2 border-t pt-2">
          {commit.author?.avatar_url ? (
            <Image
              src={commit.author.avatar_url}
              alt={commit.author.login}
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : (
            <div className="bg-muted h-5 w-5 rounded-full" />
          )}
          <span className="text-muted-foreground text-sm">
            {commit.commit.author.name} · {formatDate(commit.commit.author.date, lang)}
          </span>
          <code className="text-muted-foreground bg-muted ml-auto rounded px-2 py-1 font-mono text-xs">
            {commit.sha.slice(0, 7)}
          </code>
        </div>
      </div>

      {/* Files changed. */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">
          {dict.commits.filesChanged}
          <span className="text-muted-foreground ml-2 font-normal">
            {commit.files.length}
            {dict.commits.countSuffix}
          </span>
          <span className="ml-2 font-mono text-xs font-normal">
            <span className="text-green-600">+{commit.stats.additions}</span>{" "}
            <span className="text-red-500">-{commit.stats.deletions}</span>
          </span>
        </h2>

        <FilesChangedWithTree
          files={commit.files}
          diffDict={dict.commits}
          treeDict={dict.commits.tree}
        />
      </div>
    </main>
  );
}
