import { clsx, type ClassValue } from "clsx";
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

export function getLanguage(filename: string) {
  const ext = filename.split(".").pop() ?? "";
  const map: Record<string, string> = {
    ts: "typescript", tsx: "tsx", js: "javascript", jsx: "jsx",
    py: "python", go: "go", rs: "rust", java: "java",
    kt: "kotlin", swift: "swift", rb: "ruby", php: "php",
    md: "markdown", mdx: "mdx", json: "json",
    yaml: "yaml", yml: "yaml", toml: "toml",
    css: "css", scss: "scss", html: "html",
    sh: "bash", bash: "bash", zsh: "bash",
    sql: "sql", graphql: "graphql",
    dockerfile: "dockerfile",
  };
  return map[ext.toLowerCase()] ?? "text";
}
