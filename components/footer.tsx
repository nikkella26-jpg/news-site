"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetCookies = () => {
    // Tar bort cookien så att bannern dyker upp igen vid reload
    // Vi använder document.cookie direkt för att undvika import-problem under SSR
    document.cookie = "news_site_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  return (
    <footer className="border-t py-12 bg-slate-50 dark:bg-slate-950/20">
      <div className="container mx-auto px-6 flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-8">
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground hover:text-cyan-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium text-muted-foreground hover:text-cyan-600 transition-colors"
          >
            Terms of Service
          </Link>

          <button
            onClick={resetCookies}
            aria-label="Reset and manage cookie consent preferences"
            className="text-sm font-medium text-muted-foreground hover:text-cyan-600 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-500 outline-offset-4"
          >
            Manage Cookies
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground tracking-widest uppercase font-black opacity-50">
            © {mounted ? new Date().getFullYear() : "2026"} Nordic Express
          </p>
          <p className="text-[10px] text-muted-foreground/60 italic">
            Crafting the future of Northern journalism.
          </p>
        </div>
      </div>
    </footer>
  );
}
