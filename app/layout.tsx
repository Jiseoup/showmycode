import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { defaultLocale } from "@/lib/i18n";
import { siteUrl, seoEnabled } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const title = "showmycode — Share private GitHub repositories securely";
const description =
  "Self-hosted code viewer that grants read-only access to specific private GitHub repositories. Share one link with interviewers or collaborators — no GitHub account or personal access token needed on their side.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s · showmycode" },
  description,
  applicationName: "showmycode",
  keywords: [
    "share private GitHub repository",
    "private repo viewer",
    "read-only code sharing",
    "self-hosted code viewer",
    "GitHub portfolio for interviews",
  ],
  openGraph: {
    type: "website",
    siteName: "showmycode",
    title,
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
  // Keep the deployment out of search results unless it has opted in. Open Graph
  // above is unaffected: it only shapes link previews when someone shares the URL.
  ...(seoEnabled ? {} : { robots: { index: false, follow: false } }),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The locale is resolved in proxy.ts and passed down as a header: this layout
  // sits above app/[lang], so it has no locale param to read.
  const lang = (await headers()).get("x-locale") ?? defaultLocale;

  return (
    <html lang={lang} suppressHydrationWarning>
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
