"use client";

import { useState } from "react";
import type { GhPullFile } from "@/lib/github";

type Dict = {
  added: string;
  removed: string;
  modified: string;
  renamed: string;
  binaryFile: string;
  countSuffix: string;
  foldAll: string;
  unfoldAll: string;
};

function FileStatusBadge({
  status,
  dict,
}: {
  status: GhPullFile["status"];
  dict: Pick<Dict, "added" | "removed" | "modified" | "renamed">;
}) {
  const map: Record<string, { label: string; cls: string }> = {
    added: {
      label: dict.added,
      cls: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    },
    removed: {
      label: dict.removed,
      cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    },
    modified: {
      label: dict.modified,
      cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    },
    renamed: {
      label: dict.renamed,
      cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    },
  };
  const { label, cls } = map[status] ?? map.modified;
  return (
    <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
  );
}

function DiffView({ patch }: { patch: string }) {
  const lines = patch.split("\n");
  return (
    <div className="overflow-x-auto font-mono text-xs leading-5">
      {lines.map((line, i) => {
        let cls: string;
        if (line.startsWith("@@"))
          cls = "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400";
        else if (line.startsWith("+"))
          cls = "bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300";
        else if (line.startsWith("-"))
          cls = "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300";
        else cls = "text-muted-foreground";
        return (
          <div key={i} className={`px-4 whitespace-pre ${cls}`}>
            {line || " "}
          </div>
        );
      })}
    </div>
  );
}

export function FilesChanged({ files, dict }: { files: GhPullFile[]; dict: Dict }) {
  // Keyed by file SHA so that fold state survives list re-renders without index drift.
  const [folded, setFolded] = useState<Record<string, boolean>>({});

  const allFolded = files.every((f) => folded[f.sha]);
  const toggleAll = () => {
    if (allFolded) {
      setFolded({});
    } else {
      setFolded(Object.fromEntries(files.map((f) => [f.sha, true])));
    }
  };

  const toggle = (sha: string) => setFolded((prev) => ({ ...prev, [sha]: !prev[sha] }));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          <span className="text-green-600">+{files.reduce((s, f) => s + f.additions, 0)}</span>{" "}
          <span className="text-red-500">-{files.reduce((s, f) => s + f.deletions, 0)}</span>
          {" · "}
          {files.length}
          {dict.countSuffix}
        </p>
        <button
          onClick={toggleAll}
          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          {allFolded ? dict.unfoldAll : dict.foldAll}
        </button>
      </div>

      <div className="space-y-3">
        {files.map((file) => {
          const isFolded = !!folded[file.sha];
          return (
            <div key={file.sha} className="border-border overflow-hidden rounded-lg border">
              <button
                onClick={() => toggle(file.sha)}
                className="bg-muted/50 border-border hover:bg-muted flex w-full flex-wrap items-center gap-2 border-b px-4 py-2 text-left transition-colors"
              >
                <span
                  className={`text-muted-foreground shrink-0 transition-transform ${isFolded ? "-rotate-90" : ""}`}
                >
                  ▾
                </span>
                <FileStatusBadge status={file.status} dict={dict} />
                <span className="min-w-0 flex-1 truncate font-mono text-xs font-medium">
                  {file.status === "renamed" && file.previous_filename
                    ? `${file.previous_filename} → ${file.filename}`
                    : file.filename}
                </span>
                <span className="text-muted-foreground shrink-0 font-mono text-xs">
                  <span className="text-green-600">+{file.additions}</span>{" "}
                  <span className="text-red-500">-{file.deletions}</span>
                </span>
              </button>

              {!isFolded &&
                (file.patch ? (
                  <DiffView patch={file.patch} />
                ) : (
                  <p className="text-muted-foreground px-4 py-3 text-xs italic">
                    {dict.binaryFile}
                  </p>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
