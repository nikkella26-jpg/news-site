"use client";

import React from "react";
import PriceCard from "./PriceCard";

type Plan = {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description?: string;
  priceId?: string;
};

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 4.99,
    interval: "month",
    description: "Access to standard articles and newsletters.",
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    interval: "month",
    description: "Full access to archives, exclusive content, and no ads.",
  },
];

export default function PlansList() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
      {PLANS.map((p) => (
        <PriceCard
          key={p.id}
          id={p.id}
          name={p.name}
          price={p.price}
          interval={p.interval}
          description={p.description}
        />
      ))}
    </div>
  );
}
