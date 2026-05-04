"use client";

import { useState } from "react";

type Props = {
  sidebar: React.ReactNode;
  filesLabel: string;
  children: React.ReactNode;
};

export function SidebarDrawer({ sidebar, filesLabel, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Mobile: overlay backdrop. */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar: fixed drawer on mobile, static column on desktop. */}
      <aside
        className={[
          "bg-background fixed inset-y-0 left-0 z-50 w-64",
          "border-border flex flex-col overflow-hidden border-r",
          "transition-transform duration-200",
          "md:relative md:inset-auto md:z-auto md:shrink-0 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {sidebar}
      </aside>

      {/* Main content area. */}
      <main className="min-w-0 flex-1 overflow-auto">
        {/* Mobile-only Files toggle button. */}
        <div className="border-border flex items-center border-b px-3 py-2 md:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label={filesLabel}
            className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 text-xs transition-colors"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path strokeLinecap="round" d="M3 5h14M3 10h14M3 15h14" />
            </svg>
            {filesLabel}
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
