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

function TreeNodeItem({
  node,
  owner,
  repo,
  lang,
  selectedPath,
  depth,
}: {
  node: TreeNode;
  owner: string;
  repo: string;
  lang: string;
  selectedPath?: string;
  depth: number;
}) {
  const [open, setOpen] = useState(
    depth < 1 || (selectedPath?.startsWith(node.path + "/") ?? false)
  );

  if (node.type === "tree") {
    return (
      <li>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 w-full text-left px-2 py-0.5 rounded text-sm hover:bg-accent transition-colors"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          <svg viewBox="0 0 16 16" className={cn("w-4 h-4 fill-current text-yellow-500 shrink-0 transition-transform", open && "rotate-0")} aria-hidden>
            {open
              ? <path d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25H7.5c-.55 0-1.07-.26-1.4-.7l-.9-1.2a.25.25 0 00-.2-.1H1.75z"/>
              : <path d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25H7.5c-.55 0-1.07-.26-1.4-.7l-.9-1.2a.25.25 0 00-.2-.1H1.75z"/>
            }
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
                depth={depth + 1}
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
        href={`/${lang}/repository/${owner}/${repo}?path=${encodeURIComponent(node.path)}`}
        className={cn(
          "flex items-center gap-1.5 w-full text-sm px-2 py-0.5 rounded transition-colors truncate",
          isSelected
            ? "bg-accent text-accent-foreground font-medium"
            : "hover:bg-accent text-muted-foreground hover:text-foreground"
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current shrink-0 opacity-50" aria-hidden>
          <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z"/>
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
}: {
  items: GhTreeItem[];
  owner: string;
  repo: string;
  lang: string;
  selectedPath?: string;
}) {
  const tree = buildTree(items);

  return (
    <ul className="text-sm space-y-0.5">
      {tree.map((node) => (
        <TreeNodeItem
          key={node.path}
          node={node}
          owner={owner}
          repo={repo}
          lang={lang}
          selectedPath={selectedPath}
          depth={0}
        />
      ))}
    </ul>
  );
}
