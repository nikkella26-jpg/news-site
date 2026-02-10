"use client";

import CookieConsent from "react-cookie-consent";
import { Button } from "@/components/ui/button";

export const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="I accept"
      declineButtonText="Deny"
      enableDeclineButton
      cookieName="my_app_consent"
      // Styling via Tailwind klasser
      containerClasses="fixed bottom-0 left-0 right-0 z-50 flex flex-col md:flex-row items-center justify-between p-4 bg-background border-t border-border shadow-lg"
      contentClasses="text-sm text-muted-foreground mb-4 md:mb-0"
      disableButtonStyles={true} // Inaktivera inline-styles för att använda Shadcn/Tailwind
      buttonWrapperClasses="flex gap-2"
    >
      We cookies to enhance the news site experince. Read all about it in{" "}
      <a href="/privacy-policy" className="underline hover:text-primary">
        Integrity policy
      </a>
      .{/* Vi mappar om knapparna till dina Shadcn UI knappar */}
      <Button variant="default" size="sm" className="ml-4">
        Accept
      </Button>
      <Button variant="outline" size="sm">
        Deny
      </Button>
    </CookieConsent>
  );
};
