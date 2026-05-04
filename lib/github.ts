const BASE = "https://api.github.com";
const PAT = process.env.GITHUB_PAT!;

const headers = {
  Authorization: `Bearer ${PAT}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

// All GitHub API calls go through this helper so PAT headers and cache policy are applied consistently.
async function ghFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}/${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${path}`);
  return res.json();
}

// Repository info.
export async function getRepo(owner: string, repo: string) {
  return ghFetch<GhRepo>(`repos/${owner}/${repo}`);
}

// Allowed repo list (from environment variables).
export function getAllowedRepos(): { owner: string; repo: string }[] {
  const owner = process.env.GITHUB_OWNER!;
  const repos = (process.env.GITHUB_REPOS ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
  return repos.map((repo) => ({ owner, repo }));
}

// File tree.
export async function getTree(owner: string, repo: string, ref = "HEAD") {
  return ghFetch<GhTree>(`repos/${owner}/${repo}/git/trees/${ref}`, { recursive: "1" });
}

// File contents.
export async function getContents(owner: string, repo: string, path: string, ref = "HEAD") {
  return ghFetch<GhContent>(`repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, { ref });
}

// Commit list. The `sha` param accepts a branch name or commit SHA.
export async function getCommits(
  owner: string,
  repo: string,
  sha = "HEAD",
  perPage = 30,
  page = 1,
) {
  return ghFetch<GhCommit[]>(`repos/${owner}/${repo}/commits`, {
    sha,
    per_page: String(perPage),
    page: String(page),
  });
}

// Branch list.
export async function getBranches(owner: string, repo: string) {
  return ghFetch<GhBranch[]>(`repos/${owner}/${repo}/branches`, { per_page: "100" });
}

// PR list.
export async function getPulls(
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "all",
  perPage = 30,
  page = 1,
) {
  return ghFetch<GhPull[]>(`repos/${owner}/${repo}/pulls`, {
    state,
    per_page: String(perPage),
    page: String(page),
  });
}

// Single PR.
export async function getPull(owner: string, repo: string, number: number) {
  return ghFetch<GhPull>(`repos/${owner}/${repo}/pulls/${number}`);
}

// PR changed files.
export async function getPullFiles(owner: string, repo: string, number: number) {
  return ghFetch<GhPullFile[]>(`repos/${owner}/${repo}/pulls/${number}/files`, {
    per_page: "100",
  });
}

// PR commit list.
export async function getPullCommits(owner: string, repo: string, number: number) {
  return ghFetch<GhCommit[]>(`repos/${owner}/${repo}/pulls/${number}/commits`, {
    per_page: "100",
  });
}

// Single commit (includes file changes).
export async function getCommit(owner: string, repo: string, sha: string) {
  return ghFetch<GhCommitDetail>(`repos/${owner}/${repo}/commits/${sha}`);
}

// Types.
export type GhRepo = {
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  default_branch: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
};

export type GhTreeItem = {
  path: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
};

export type GhTree = { tree: GhTreeItem[]; truncated: boolean };

export type GhContent = {
  name: string;
  path: string;
  content: string;
  encoding: string;
};

export type GhCommit = {
  sha: string;
  commit: {
    message: string;
    author: { name: string; email: string; date: string };
  };
  author: { login: string; avatar_url: string } | null;
};

// GhPullFile is reused here because the GitHub API returns the same file-change shape for both PR files and commit files.
export type GhCommitDetail = GhCommit & {
  stats: { additions: number; deletions: number; total: number };
  files: GhPullFile[];
};

export type GhPull = {
  number: number;
  title: string;
  state: "open" | "closed";
  user: { login: string; avatar_url: string };
  created_at: string;
  merged_at: string | null;
  body: string | null;
  labels: { name: string; color: string }[];
  head: { ref: string };
  base: { ref: string };
};

export type GhBranch = {
  name: string;
  protected: boolean;
};

export type GhPullFile = {
  sha: string;
  filename: string;
  previous_filename?: string;
  status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
};
