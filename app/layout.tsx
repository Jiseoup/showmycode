import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_NAME = process.env.SITE_NAME || "showmycode";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: "Private repository viewer for interviewers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Prevent dark mode flash on page load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              const saved = localStorage.getItem("theme");
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              if (saved === "dark" || (!saved && prefersDark)) {
                document.documentElement.classList.add("dark");
              }
            } catch {}
          `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
