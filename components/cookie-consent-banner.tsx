"use client";

import CookieConsent from "react-cookie-consent";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
      location="bottom"
      cookieName="my_app_consent"
      containerClasses="fixed bottom-0 left-0 right-0 z-50 flex flex-col md:flex-row items-center justify-between p-4 bg-background border-t border-border shadow-lg"
      contentClasses="text-sm text-muted-foreground mb-4 md:mb-0"
      buttonWrapperClasses="flex gap-2"
      onAccept={handleAccept}
      onDecline={handleDecline}
      buttonText=""
      hideOnAccept={false}

    >
      <span className="flex-1">
        We use cookies to enhance the news site experience.
        Read all about it in{" "}
        <a href="/privacy-policy" className="underline hover:text-primary">
          Integrity policy
        </a>.
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecline}
        >
          Deny
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleAccept}
        >
          Accept
        </Button>
      </div>
    </CookieConsent>
  );
};
