import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "showmycode",
  description: "Private repository viewer for interviewers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 새로고침 시 다크모드 깜빡임 방지 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const saved = localStorage.getItem("theme");
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              if (saved === "dark" || (!saved && prefersDark)) {
                document.documentElement.classList.add("dark");
              }
            } catch {}
          `
        }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
