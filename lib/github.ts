const BASE = "https://api.github.com";
const PAT  = process.env.GITHUB_PAT!;

const headers = {
  Authorization: `Bearer ${PAT}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

async function ghFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}/${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${path}`);
  return res.json();
}

// 레포 정보
export async function getRepo(owner: string, repo: string) {
  return ghFetch<GhRepo>(`repos/${owner}/${repo}`);
}

// 허용된 레포 목록 (환경변수 기반)
export function getAllowedRepos(): { owner: string; repo: string }[] {
  const owner = process.env.GITHUB_OWNER!;
  const repos = (process.env.GITHUB_REPOS ?? "").split(",").map((r) => r.trim()).filter(Boolean);
  return repos.map((repo) => ({ owner, repo }));
}

// 파일 트리
export async function getTree(owner: string, repo: string, sha = "HEAD") {
  return ghFetch<GhTree>(`repos/${owner}/${repo}/git/trees/${sha}`, { recursive: "1" });
}

// 파일 내용
export async function getContents(owner: string, repo: string, path: string) {
  return ghFetch<GhContent>(`repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`);
}

// 커밋 목록
export async function getCommits(owner: string, repo: string, perPage = 30) {
  return ghFetch<GhCommit[]>(`repos/${owner}/${repo}/commits`, { per_page: String(perPage) });
}

// PR 목록
export async function getPulls(owner: string, repo: string, state: "open" | "closed" | "all" = "all") {
  return ghFetch<GhPull[]>(`repos/${owner}/${repo}/pulls`, { state, per_page: "50" });
}

// --- 타입 ---
export type GhRepo = {
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  default_branch: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
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
