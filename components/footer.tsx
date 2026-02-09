"use client";

import Link from "next/link";
import { Cookies } from "react-cookie-consent";

export default function Footer() {
  const resetCookies = () => {
    // Tar bort cookien så att bannern dyker upp igen vid reload
    Cookies.remove("my_app_consent");
    window.location.reload();
  };

  return (
    <footer className="border-t py-6 bg-background">
      <div className="container mx-auto flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
            Privacy Policy
          </Link>
          
          <button 
            onClick={resetCookies}
            className="text-sm text-muted-foreground hover:underline cursor-pointer"
          >
            Handle cookies
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          © {new Date().getFullYear()} Your news site. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
