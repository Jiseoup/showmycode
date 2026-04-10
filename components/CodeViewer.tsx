import { codeToHtml } from "shiki";
import { getContents } from "@/lib/github";
import { getLanguage } from "@/lib/utils";

export async function CodeViewer({
  owner,
  repo,
  path,
  branch = "HEAD",
}: {
  owner: string;
  repo: string;
  path: string;
  branch?: string;
}) {
  const file = await getContents(owner, repo, path, branch);

  // Decode base64 content.
  const raw = file.encoding === "base64"
    ? Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf-8")
    : file.content;

  const lang = getLanguage(path);

  const html = await codeToHtml(raw, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
  });

  return (
    <div
      className="text-sm overflow-auto [&>pre]:p-5 [&>pre]:min-h-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
