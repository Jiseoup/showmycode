import Link from "next/link";
import Image from "next/image";
import { getCommit } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { getDictionary, type Locale } from "@/lib/i18n.server";
import { FilesChanged } from "@/components/FilesChanged";

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
    <main className="flex-1 overflow-auto max-w-4xl mx-auto w-full px-6 py-6 space-y-5">
      <Link
        href={`/${lang}/repository/${owner}/${repo}/commits`}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ← {dict.commits.backToList}
      </Link>

      {/* Commit header. */}
      <div className="border border-border rounded-lg p-4 space-y-3">
        <div>
          <p className="font-semibold text-base leading-snug">{title}</p>
          {body && (
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{body}</p>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border flex-wrap">
          {commit.author?.avatar_url ? (
            <Image
              src={commit.author.avatar_url}
              alt={commit.author.login}
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-muted" />
          )}
          <span className="text-sm text-muted-foreground">
            {commit.commit.author.name} · {formatDate(commit.commit.author.date, lang)}
          </span>
          <code className="ml-auto text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
            {commit.sha.slice(0, 7)}
          </code>
        </div>
      </div>

      {/* Files changed. */}
      <div>
        <h2 className="text-sm font-semibold mb-3">
          {dict.commits.filesChanged}
          <span className="ml-2 font-normal text-muted-foreground">
            {commit.files.length}{dict.commits.countSuffix}
          </span>
          <span className="ml-2 text-xs font-mono font-normal">
            <span className="text-green-600">+{commit.stats.additions}</span>
            {" "}
            <span className="text-red-500">-{commit.stats.deletions}</span>
          </span>
        </h2>

        <FilesChanged files={commit.files} dict={dict.commits} />
      </div>
    </main>
  );
}
