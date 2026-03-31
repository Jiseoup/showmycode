import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { GhRepo } from "@/lib/github";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
  PHP: "#4F5D95",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
};

export function RepoCard({
  repo,
  lang,
  dict,
}: {
  repo: GhRepo;
  lang: string;
  dict: { noDescription: string; updated: string; private: string; public: string };
}) {
  const [owner, name] = repo.full_name.split("/");
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? "#888") : null;

  return (
    <Link
      href={`/${lang}/repository/${owner}/${name}`}
      className="block rounded-lg border border-border bg-card p-5 hover:border-foreground/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {/* 레포 이름 */}
          <p className="font-semibold text-blue-600 dark:text-blue-400 truncate">
            {name}
          </p>

          {/* 설명 */}
          {repo.description ? (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {repo.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/50 mt-1 italic">
              {dict.noDescription}
            </p>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
            {langColor && repo.language && (
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: langColor }}
                />
                {repo.language}
              </span>
            )}

            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current" aria-hidden>
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
              {repo.stargazers_count}
            </span>

            <span>{dict.updated} {formatDate(repo.updated_at, lang)}</span>
          </div>
        </div>

        {/* Private / Public 뱃지 */}
        <span className="shrink-0 text-xs border border-border rounded-full px-2 py-0.5 text-muted-foreground">
          {repo.private ? "Private" : "Public"}
        </span>
      </div>
    </Link>
  );
}
