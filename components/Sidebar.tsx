import { Suspense } from "react";
import { getTree } from "@/lib/github";
import { FileTree } from "@/components/FileTree";
import { BranchSelector } from "@/components/BranchSelector";

type Props = {
  owner: string;
  repo: string;
  lang: string;
  expandAllLabel: string;
  collapseAllLabel: string;
  selectedPath?: string;
  branches: string[];
  branch: string;
};

export async function Sidebar({
  owner,
  repo,
  lang,
  expandAllLabel,
  collapseAllLabel,
  selectedPath,
  branches,
  branch,
}: Props) {
  const { tree } = await getTree(owner, repo, branch);
  const defaultOpenDepth = Number(process.env.FILE_TREE_DEPTH) || 0;

  return (
    <FileTree
      items={tree}
      owner={owner}
      repo={repo}
      lang={lang}
      selectedPath={selectedPath}
      branch={branch}
      defaultOpenDepth={defaultOpenDepth}
      expandAllLabel={expandAllLabel}
      collapseAllLabel={collapseAllLabel}
      branchSelector={
        <Suspense key="branch-selector" fallback={null}>
          <BranchSelector branches={branches} current={branch} />
        </Suspense>
      }
    />
  );
}
