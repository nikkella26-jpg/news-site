"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function CookiePage() {
  const [accepted, setAccepted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("cookie-consent") === "true";
  });

  const toggleConsent = () => {
    const newValue = !accepted;
    localStorage.setItem("cookie-consent", String(newValue));
    setAccepted(newValue);
    
    toast.success(
      newValue 
        ? "Cookies have been enabled." 
        : "Cookies have been disabled."
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cookie Preferences</h1>

      <button
        onClick={toggleConsent}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {accepted ? "Disable Cookies" : "Enable Cookies"}
      </button>
    </div>
  );
}
