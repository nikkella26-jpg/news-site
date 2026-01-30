"use client";

import React from "react";
import { Button } from "../ui/button";

export type Plan = {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description?: string;
  priceId?: string; // provided later when hooking up Stripe
};

export default function PriceCard({
  id,
  name,
  price,
  interval,
  description,
}: Plan) {
  const handleSubscribe = async () => {
    // Placeholder: when to integrate Stripe, replace this with real checkout call
    alert(`Start checkout for ${name} (${id}) — integrate Stripe here`);
  };

  return (
    <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold">${price.toFixed(2)}</div>
          <div className="text-sm text-zinc-500">/ {interval}</div>
        </div>
      </div>

      {description && <p className="mt-3 text-sm text-zinc-600">{description}</p>}

      <div className="mt-6">
        <Button className="w-full" onClick={handleSubscribe}>
          Subscribe
        </Button>
      </div>
    </div>
  );
}
