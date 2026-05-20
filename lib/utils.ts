import { clsx, type ClassValue } from "clsx";
import type { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string, lang = "ko") {
  return new Date(iso).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function labelStyle(color: string): CSSProperties {
  const safe = /^[0-9a-fA-F]{6}$/.test(color) ? color : "8b949e";
  const r = parseInt(safe.slice(0, 2), 16);
  const g = parseInt(safe.slice(2, 4), 16);
  const b = parseInt(safe.slice(4, 6), 16);
  // WCAG relative luminance — picks readable black/white text in light mode.
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return {
    "--label": `#${safe}`,
    "--label-fg": luminance > 0.5 ? "#000" : "#fff",
  } as CSSProperties;
}

export function getLanguage(filename: string) {
  const ext = filename.split(".").pop() ?? "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    py: "python",
    go: "go",
    rs: "rust",
    java: "java",
    kt: "kotlin",
    swift: "swift",
    rb: "ruby",
    php: "php",
    md: "markdown",
    mdx: "mdx",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    css: "css",
    scss: "scss",
    html: "html",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    sql: "sql",
    graphql: "graphql",
    dockerfile: "dockerfile",
  };
  return map[ext.toLowerCase()] ?? "text";
}
