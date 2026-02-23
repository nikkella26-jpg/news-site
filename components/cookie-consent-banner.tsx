"use client";

import CookieConsent from "react-cookie-consent";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    setVisible(false);
  };

  const handleDecline = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <CookieConsent
      location="none"
      cookieName="news_site_consent"
      disableStyles={true}
      containerClasses="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-5xl"
      onAccept={handleAccept}
      onDecline={handleDecline}
      buttonText=""
      hideOnAccept={false}
    >
      <div className="relative overflow-hidden rounded-[1.5rem] bg-background/80 backdrop-blur-2xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {/* Top Accent Line (Half breadth hint) */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-cyan-500 via-indigo-500 to-cyan-500 opacity-80" />

        <div className="flex items-center gap-4 flex-1">
          <div className="hidden md:flex w-10 h-10 bg-primary/10 rounded-xl items-center justify-center shrink-0 border border-primary/20">
            <span className="text-xl">🍪</span>
          </div>
          <p className="text-sm text-muted-foreground leading-snug max-w-3xl">
            <span className="text-foreground font-black uppercase tracking-widest text-[10px] block mb-1">Privacy Notice</span>
            We use cookies to curate your personal news feed. By staying, you agree to our
            <Link href="/privacy" className="text-primary font-bold hover:underline mx-1">
              Privacy Policy
            </Link>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <Button
            variant="ghost"
            className="flex-1 md:flex-none h-11 px-6 rounded-xl font-bold hover:bg-destructive/10 hover:text-destructive transition-colors text-xs"
            onClick={handleDecline}
          >
            Decline
          </Button>
          <Button
            variant="default"
            className="flex-1 md:flex-none h-11 px-10 rounded-xl font-black bg-primary shadow-lg shadow-primary/20 hover:scale-[1.03] transition-all text-xs uppercase tracking-widest"
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </CookieConsent>
  );
};
