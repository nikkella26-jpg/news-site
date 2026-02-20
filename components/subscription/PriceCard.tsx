"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";

export type Plan = {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description?: string;
};

export default function PriceCard({
  id,
  name,
  price,
  interval,
  description,
}: Plan) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      await authClient.subscription.upgrade({
        plan: "basic",
        annual: interval === "year",
        successUrl: "http://localhost:3000/account",
        cancelUrl: "http://localhost:3000/subscribe",
        disableRedirect: false,
      });
    } catch (error) {
      console.error("Subscription error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold capitalize">{name}</h3>

        <div className="text-right">
          <div className="text-2xl font-bold">${price.toFixed(2)}</div>
          <div className="text-sm text-zinc-500">/ {interval}</div>
        </div>
      </div>

      {description && (
        <p className="mt-3 text-sm text-zinc-600">{description}</p>
      )}

      <div className="mt-6">
        <Button className="w-full" onClick={handleSubscribe} disabled={loading}>
          {loading ? "Redirecting..." : "Subscribe"}
        </Button>
      </div>
    </div>
  );
}
