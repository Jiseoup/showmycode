import { Suspense } from "react";
import { getTree } from "@/lib/github";
import { FileTree } from "@/components/FileTree";
import { BranchSelector } from "@/components/BranchSelector";

type Props = {
  owner: string;
  repo: string;
  lang: string;
  filesLabel: string;
  selectedPath?: string;
  branches: string[];
  branch: string;
};

export async function Sidebar({ owner, repo, lang, filesLabel, selectedPath, branches, branch }: Props) {
  const { tree } = await getTree(owner, repo, branch);
  const defaultOpenDepth = Number(process.env.FILE_TREE_DEPTH) || 0;

  return (
    <aside className="flex flex-col h-full overflow-hidden">
      <div className="px-3 py-2.5 border-b border-border space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {filesLabel}
        </p>
        <Suspense>
          <BranchSelector branches={branches} current={branch} />
        </Suspense>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <FileTree
          items={tree}
          owner={owner}
          repo={repo}
          lang={lang}
          selectedPath={selectedPath}
          branch={branch}
          defaultOpenDepth={defaultOpenDepth}
        />
      </div>
    </aside>
  );
}
