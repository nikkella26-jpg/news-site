"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function NewsletterPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Note: Initial state might need to be fetched from a server component or a GET API
  // For now, we'll keep it simple and focus on the toast.

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to update preferences");

      const data = await res.json();
      setSubscribed(data.newsletterSubscribed);
      
      toast.success(
        data.newsletterSubscribed 
          ? "Successfully subscribed to newsletter!" 
          : "Unsubscribed from newsletter."
      );
    } catch (error) {
      toast.error("Failed to update newsletter preferences.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Newsletter Preferences</h1>

      <button
        onClick={handleToggle}
        disabled={isLoading}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {isLoading ? "Saving..." : (subscribed ? "Unsubscribe" : "Subscribe")}
      </button>
    </div>
  );
}
