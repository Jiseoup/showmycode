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

  const [repoData, branches] = await Promise.all([
    getRepo(owner, repo),
    getBranches(owner, repo),
  ]);

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
          filesLabel={dict.code.files}
          branches={branchNames}
          branch={branch}
        />
      }
    >
      {selectedPath ? (
        <div>
          <div className="px-4 py-2 border-b border-border bg-muted/40 text-sm font-mono text-muted-foreground">
            {selectedPath}
          </div>
          <CodeViewer owner={owner} repo={repo} path={selectedPath} branch={branch} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          {dict.code.selectFile}
        </div>
      )}
    </SidebarDrawer>
  );
}
