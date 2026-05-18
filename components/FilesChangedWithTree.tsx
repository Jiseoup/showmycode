"use client";

import { ComponentProps, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { GhPullFile } from "@/lib/github";
import { FilesChanged } from "@/components/FilesChanged";

type TreeNode =
  | { kind: "dir"; name: string; path: string; children: TreeNode[] }
  | { kind: "file"; name: string; path: string; file: GhPullFile };

type TreeDict = {
  title: string;
  expandAll: string;
  collapseAll: string;
};

type Props = {
  files: GhPullFile[];
  diffDict: ComponentProps<typeof FilesChanged>["dict"];
  treeDict: TreeDict;
};

function buildChangedTree(files: GhPullFile[]): {
  tree: TreeNode[];
  orderedFiles: GhPullFile[];
  dirPaths: string[];
} {
  type DirNode = {
    kind: "dir";
    name: string;
    path: string;
    children: Array<DirNode | TreeNode>;
  };
  const root: DirNode = { kind: "dir", name: "", path: "", children: [] };

  for (const file of files) {
    const parts = file.filename.split("/");
    let cursor: DirNode = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const path = parts.slice(0, i + 1).join("/");

      if (isLast) {
        cursor.children.push({ kind: "file", name: part, path, file });
      } else {
        let next = cursor.children.find((c): c is DirNode => c.kind === "dir" && c.name === part);
        if (!next) {
          next = { kind: "dir", name: part, path, children: [] };
          cursor.children.push(next);
        }
        cursor = next;
      }
    }
  }

  // Directories first, alphabetical at each depth.
  const sortChildren = (nodes: Array<DirNode | TreeNode>): TreeNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map<TreeNode>((n) =>
        n.kind === "dir"
          ? { kind: "dir", name: n.name, path: n.path, children: sortChildren(n.children) }
          : n,
      );
  };

  const tree = sortChildren(root.children);

  // DFS through the sorted tree to mirror diff order in the right pane.
  const orderedFiles: GhPullFile[] = [];
  const dirPaths: string[] = [];
  const walk = (nodes: TreeNode[]) => {
    for (const n of nodes) {
      if (n.kind === "dir") {
        dirPaths.push(n.path);
        walk(n.children);
      } else {
        orderedFiles.push(n.file);
      }
    }
  };
  walk(tree);

  return { tree, orderedFiles, dirPaths };
}

function statusDot(status: GhPullFile["status"]): string {
  switch (status) {
    case "added":
      return "bg-green-500";
    case "removed":
      return "bg-red-500";
    case "renamed":
      return "bg-blue-500";
    case "modified":
    case "changed":
      return "bg-yellow-500";
    default:
      return "bg-muted-foreground/40";
  }
}

function scrollToFile(sha: string) {
  const el = document.getElementById(`file-${sha}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function TreeRow({
  node,
  depth,
  openPaths,
  onToggleDir,
}: {
  node: TreeNode;
  depth: number;
  openPaths: Set<string>;
  onToggleDir: (path: string) => void;
}) {
  if (node.kind === "dir") {
    const open = openPaths.has(node.path);
    return (
      <li>
        <button
          type="button"
          onClick={() => onToggleDir(node.path)}
          className="hover:bg-accent flex w-full items-center gap-1.5 rounded px-2 py-0.5 text-left text-sm transition-colors"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          <svg
            viewBox="0 0 16 16"
            className={cn(
              "text-muted-foreground h-3.5 w-3.5 shrink-0 fill-current transition-transform",
              open ? "rotate-90" : "rotate-0",
            )}
            aria-hidden
          >
            <path d="M6 4l4 4-4 4V4z" />
          </svg>
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4 shrink-0 fill-current text-yellow-500"
            aria-hidden
          >
            <path d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25H7.5c-.55 0-1.07-.26-1.4-.7l-.9-1.2a.25.25 0 00-.2-.1H1.75z" />
          </svg>
          <span className="truncate">{node.name}</span>
        </button>
        {open && (
          <ul>
            {node.children.map((child) => (
              <TreeRow
                key={child.path}
                node={child}
                depth={depth + 1}
                openPaths={openPaths}
                onToggleDir={onToggleDir}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  const file = node.file;
  return (
    <li>
      <button
        type="button"
        onClick={() => scrollToFile(file.sha)}
        aria-label={file.filename}
        title={file.filename}
        className="hover:bg-accent text-muted-foreground hover:text-foreground flex w-full items-center gap-1.5 rounded px-2 py-0.5 text-left text-sm transition-colors"
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {/* Spacer matches the folder row's chevron so files sit aligned with folder content. */}
        <span className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className={cn("h-2 w-2 shrink-0 rounded-full", statusDot(file.status))} aria-hidden />
        <span className="truncate">{node.name}</span>
        <span className="ml-auto shrink-0 font-mono text-[10px]">
          <span className="text-green-600">+{file.additions}</span>{" "}
          <span className="text-red-500">-{file.deletions}</span>
        </span>
      </button>
    </li>
  );
}

export function FilesChangedWithTree({ files, diffDict, treeDict }: Props) {
  const { tree, orderedFiles, dirPaths } = useMemo(() => buildChangedTree(files), [files]);

  // All directories open by default — matches GitHub.
  const [openPaths, setOpenPaths] = useState<Set<string>>(() => new Set(dirPaths));

  const allCollapsed = openPaths.size === 0;
  const toggleAll = () => setOpenPaths(allCollapsed ? new Set(dirPaths) : new Set());
  const onToggleDir = (path: string) =>
    setOpenPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  return (
    <div className="flex gap-4 md:gap-6">
      <aside className="sticky top-0 hidden max-h-[calc(100dvh-8rem)] w-64 shrink-0 self-start overflow-hidden md:flex md:flex-col">
        <div className="border-border flex items-center justify-between gap-2 border-b px-3 py-2">
          <span className="text-foreground truncate text-xs font-semibold tracking-wide uppercase">
            {treeDict.title}
          </span>
          <button
            type="button"
            onClick={toggleAll}
            title={allCollapsed ? treeDict.expandAll : treeDict.collapseAll}
            aria-label={allCollapsed ? treeDict.expandAll : treeDict.collapseAll}
            className="text-muted-foreground hover:text-foreground hover:bg-accent shrink-0 rounded p-1 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M9 9H4v1h5V9z" />
              {allCollapsed && <path fillRule="evenodd" clipRule="evenodd" d="M7 12V7H6v5h1z" />}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 3l1-1h7l1 1v7l-1 1h-2v2l-1 1H3l-1-1V6l1-1h2V3zm1 2h4l1 1v4h2V3H6v2zm4 1H3v7h7V6z"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-0.5 text-sm">
            {tree.map((node) => (
              <TreeRow
                key={node.path}
                node={node}
                depth={0}
                openPaths={openPaths}
                onToggleDir={onToggleDir}
              />
            ))}
          </ul>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <FilesChanged files={orderedFiles} dict={diffDict} />
      </div>
    </div>
  );
}
