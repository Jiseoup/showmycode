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
      className="border-border bg-card hover:border-foreground/30 block rounded-lg border p-5 transition-all hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {/* Repo name. */}
          <p className="truncate font-semibold text-blue-600 dark:text-blue-400">{name}</p>

          {/* Description. */}
          {repo.description ? (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{repo.description}</p>
          ) : (
            <p className="text-muted-foreground/50 mt-1 text-sm italic">{dict.noDescription}</p>
          )}

          {/* Topic tags. */}
          {repo.topics.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {repo.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-600 dark:text-blue-400"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* Meta info. */}
          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-xs">
            {langColor && repo.language && (
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: langColor }}
                />
                {repo.language}
              </span>
            )}

            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden>
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
              {repo.stargazers_count}
            </span>

            <span>
              {dict.updated} {formatDate(repo.updated_at, lang)}
            </span>
          </div>
        </div>

        {/* Private/Public badge. */}
        <span className="border-border text-muted-foreground shrink-0 rounded-full border px-2 py-0.5 text-xs">
          {repo.private ? "Private" : "Public"}
        </span>
      </div>
    </Link>
  );
}
