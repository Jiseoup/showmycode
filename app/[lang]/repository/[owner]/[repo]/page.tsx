import { getRepo, getBranches } from "@/lib/github";
import { Sidebar } from "@/components/Sidebar";
import { SidebarDrawer } from "@/components/SidebarDrawer";
import { CodeViewer } from "@/components/CodeViewer";
import { getDictionary, type Locale } from "@/lib/i18n.server";

type Props = {
  params: Promise<{ lang: string; owner: string; repo: string }>;
  searchParams: Promise<{ path?: string; branch?: string }>;
};

export default async function CodePage({ params, searchParams }: Props) {
  const { lang, owner, repo } = await params;
  const { path: selectedPath, branch: branchParam } = await searchParams;
  const dict = await getDictionary(lang as Locale);

  const [repoData, branches] = await Promise.all([getRepo(owner, repo), getBranches(owner, repo)]);

  const branchNames = branches.map((b) => b.name);
  const branch = branchNames.find((n) => n === branchParam) ?? repoData.default_branch;

  return (
    <SidebarDrawer
      filesLabel={dict.code.files}
      sidebar={
        <Sidebar
          owner={owner}
          repo={repo}
          selectedPath={selectedPath}
          lang={lang as Locale}
          expandAllLabel={dict.code.expandAll}
          collapseAllLabel={dict.code.collapseAll}
          branches={branchNames}
          branch={branch}
        />
      }
    >
      {selectedPath ? (
        <div>
          <div className="border-border bg-muted/40 text-muted-foreground border-b px-4 py-2 font-mono text-sm">
            {selectedPath}
          </div>
          <CodeViewer owner={owner} repo={repo} path={selectedPath} branch={branch} />
        </div>
      ) : (
        <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
          {dict.code.selectFile}
        </div>
      )}
    </SidebarDrawer>
  );
}
