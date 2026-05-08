"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { GhTreeItem } from "@/lib/github";

type TreeNode = {
  name: string;
  path: string;
  type: "blob" | "tree";
  children?: TreeNode[];
};

function buildTree(items: GhTreeItem[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const item of items) {
    const parts = item.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const path = parts.slice(0, i + 1).join("/");
      const isLast = i === parts.length - 1;

      let node = current.find((n) => n.name === part);
      if (!node) {
        node = {
          name: part,
          path,
          type: isLast ? item.type : "tree",
          children: isLast && item.type === "blob" ? undefined : [],
        };
        current.push(node);
      }
      current = node.children ?? [];
    }
  }

  // Sort: directories first, then files.
  const sort = (nodes: TreeNode[]): TreeNode[] =>
    nodes
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "tree" ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((n) => ({ ...n, children: n.children ? sort(n.children) : undefined }));

  return sort(root);
}

// Walk the tree once to seed which directory paths should be open initially.
function collectInitialOpen(
  nodes: TreeNode[],
  selectedPath: string | undefined,
  depth: number,
  defaultOpenDepth: number,
  acc: Set<string>,
): void {
  for (const n of nodes) {
    if (n.type !== "tree") continue;
    const shouldOpen =
      depth < defaultOpenDepth || (selectedPath?.startsWith(n.path + "/") ?? false);
    if (shouldOpen) acc.add(n.path);
    if (n.children) collectInitialOpen(n.children, selectedPath, depth + 1, defaultOpenDepth, acc);
  }
}

function TreeNodeItem({
  node,
  owner,
  repo,
  lang,
  selectedPath,
  branch,
  depth,
  openPaths,
  onToggle,
}: {
  node: TreeNode;
  owner: string;
  repo: string;
  lang: string;
  selectedPath?: string;
  branch: string;
  depth: number;
  openPaths: Set<string>;
  onToggle: (path: string) => void;
}) {
  if (node.type === "tree") {
    const open = openPaths.has(node.path);
    return (
      <li>
        <button
          onClick={() => onToggle(node.path)}
          className="hover:bg-accent flex w-full items-center gap-1.5 rounded px-2 py-0.5 text-left text-sm transition-colors"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          <svg
            viewBox="0 0 16 16"
            className={cn(
              "h-4 w-4 shrink-0 fill-current text-yellow-500 transition-transform",
              open && "rotate-0",
            )}
            aria-hidden
          >
            {open ? (
              <path d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25H7.5c-.55 0-1.07-.26-1.4-.7l-.9-1.2a.25.25 0 00-.2-.1H1.75z" />
            ) : (
              <path d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25H7.5c-.55 0-1.07-.26-1.4-.7l-.9-1.2a.25.25 0 00-.2-.1H1.75z" />
            )}
          </svg>
          <span className="truncate">{node.name}</span>
        </button>
        {open && node.children && (
          <ul>
            {node.children.map((child) => (
              <TreeNodeItem
                key={child.path}
                node={child}
                owner={owner}
                repo={repo}
                lang={lang}
                selectedPath={selectedPath}
                branch={branch}
                depth={depth + 1}
                openPaths={openPaths}
                onToggle={onToggle}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  const isSelected = selectedPath === node.path;
  return (
    <li>
      <Link
        href={`/${lang}/repository/${owner}/${repo}?path=${encodeURIComponent(node.path)}&branch=${encodeURIComponent(branch)}`}
        className={cn(
          "flex w-full items-center gap-1.5 truncate rounded px-2 py-0.5 text-sm transition-colors",
          isSelected
            ? "bg-accent text-accent-foreground font-medium"
            : "hover:bg-accent text-muted-foreground hover:text-foreground",
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 fill-current opacity-50" aria-hidden>
          <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z" />
        </svg>
        <span className="truncate">{node.name}</span>
      </Link>
    </li>
  );
}

export function FileTree({
  items,
  owner,
  repo,
  lang,
  selectedPath,
  branch,
  defaultOpenDepth = 0,
  expandAllLabel,
  collapseAllLabel,
  branchSelector,
}: {
  items: GhTreeItem[];
  owner: string;
  repo: string;
  lang: string;
  selectedPath?: string;
  branch: string;
  defaultOpenDepth?: number;
  expandAllLabel: string;
  collapseAllLabel: string;
  branchSelector?: React.ReactNode;
}) {
  const tree = buildTree(items);
  const [openPaths, setOpenPaths] = useState<Set<string>>(() => {
    const set = new Set<string>();
    collectInitialOpen(tree, selectedPath, 0, defaultOpenDepth, set);
    return set;
  });

  const handleToggle = (path: string) => {
    setOpenPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const allExpanded = openPaths.size === 0;
  const expandAll = () =>
    setOpenPaths(new Set(items.filter((i) => i.type === "tree").map((i) => i.path)));
  const collapseAll = () => setOpenPaths(new Set());
  const toggleAllLabel = allExpanded ? expandAllLabel : collapseAllLabel;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-border space-y-2 border-b px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-foreground truncate text-xs font-semibold tracking-wide uppercase"
            title={repo}
          >
            {repo}
          </span>
          <button
            type="button"
            onClick={allExpanded ? expandAll : collapseAll}
            title={toggleAllLabel}
            aria-label={toggleAllLabel}
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
              {allExpanded && (
                <path fillRule="evenodd" clipRule="evenodd" d="M7 12V7H6v5h1z" />
              )}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 3l1-1h7l1 1v7l-1 1h-2v2l-1 1H3l-1-1V6l1-1h2V3zm1 2h4l1 1v4h2V3H6v2zm4 1H3v7h7V6z"
              />
            </svg>
          </button>
        </div>
        {branchSelector}
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5 text-sm">
          {tree.map((node) => (
            <TreeNodeItem
              key={node.path}
              node={node}
              owner={owner}
              repo={repo}
              lang={lang}
              selectedPath={selectedPath}
              branch={branch}
              depth={0}
              openPaths={openPaths}
              onToggle={handleToggle}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
