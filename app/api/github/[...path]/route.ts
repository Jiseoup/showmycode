import { NextRequest, NextResponse } from "next/server";
import { getAllowedRepos } from "@/lib/github";

const BASE = "https://api.github.com";
const PAT  = process.env.GITHUB_PAT!;

// This route proxies all GitHub API requests so the PAT never reaches the client.
// It validates every request against the GITHUB_REPOS allowlist before forwarding.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const ghPath = path.join("/");

  // Extract owner and repo from repos/{owner}/{repo}/... and validate against allowlist.
  const match = ghPath.match(/^repos\/([^/]+)\/([^/]+)/);
  if (match) {
    const [, owner, repo] = match;
    const allowed = getAllowedRepos().some((r) => r.owner === owner && r.repo === repo);
    if (!allowed) return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  const search = req.nextUrl.search;

  const res = await fetch(`${BASE}/${ghPath}${search}`, {
    headers: {
      Authorization: `Bearer ${PAT}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
