import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F2E9] md:h-screen md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-[#F6F2E9]">
        <Navbar />

        {/* Letterhead rule — the seam between chrome and canvas */}
        <div className="h-[3px] shrink-0 bg-gradient-to-r from-[#C9A15D] via-[#E4CD9B] to-[#C9A15D]/40" />

        <main className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {/* Faint watermark crest, anchored to the canvas rather than any one card */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="pointer-events-none absolute right-6 top-6 h-24 w-24 text-[#0B1526] opacity-[0.03] sm:h-32 sm:w-32 lg:right-10 lg:top-8"
          >
            <path
              fill="currentColor"
              d="M50 2 L92 16 V46 C92 70 74 90 50 98 C26 90 8 70 8 46 V16 Z"
            />
          </svg>

          <div className="relative mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}