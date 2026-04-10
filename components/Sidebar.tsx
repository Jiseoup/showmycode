import { getTree } from "@/lib/github";
import { FileTree } from "@/components/FileTree";

type Props = {
  owner: string;
  repo: string;
  lang: string;
  filesLabel: string;
  selectedPath?: string;
};

export async function Sidebar({ owner, repo, lang, filesLabel, selectedPath }: Props) {
  const { tree } = await getTree(owner, repo);

  return (
    <aside className="flex flex-col h-full overflow-hidden">
      <div className="px-3 py-2.5 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {filesLabel}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <FileTree
          items={tree}
          owner={owner}
          repo={repo}
          lang={lang}
          selectedPath={selectedPath}
        />
      </div>
    </aside>
  );
}
