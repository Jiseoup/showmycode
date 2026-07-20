import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "showmycode",
  description: "Securely share private GitHub repositories with specific people.",
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
      <body className={inter.className}>
        {children}
        {/* Vercel Web Analytics — disabled by default so self-hosted deployments ship no tracking script. */}
        {process.env.ENABLE_ANALYTICS === "true" && <Analytics />}
      </body>
    </html>
  );
}
