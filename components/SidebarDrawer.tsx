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
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar: fixed drawer on mobile, static column on desktop. */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 bg-background",
          "border-r border-border flex flex-col overflow-hidden",
          "transition-transform duration-200",
          "md:relative md:inset-auto md:z-auto md:translate-x-0 md:shrink-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {sidebar}
      </aside>

      {/* Main content area. */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Mobile-only Files toggle button. */}
        <div className="md:hidden flex items-center px-3 py-2 border-b border-border">
          <button
            onClick={() => setOpen(true)}
            aria-label={filesLabel}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <svg
              viewBox="0 0 20 20"
              className="w-4 h-4"
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
