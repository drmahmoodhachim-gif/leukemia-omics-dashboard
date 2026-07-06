"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";

export function DashboardLayout({
  children,
  activePath,
}: {
  children: React.ReactNode;
  activePath: string;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activePath={activePath}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setMobileNavOpen(true)}
          className="rounded-lg border border-border p-2 text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold">LeukemiaOmics</span>
      </header>
      <main className="min-h-screen md:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  );
}
