"use client";

import React from "react";
import PriceCard, { Plan } from "./PriceCard";

const PLANS: Plan[] = [
  {
    id: "basic-monthly",
    name: "basic",
    price: 99,
    interval: "month",
    description: "Access to standard articles and newsletters.",
  },
  {
    id: "basic-yearly",
    name: "basic",
    price: 899,
    interval: "year",
    description: "Full access to archives, exclusive content, and no ads.",
  },
];

export default function PlansList() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
      {PLANS.map((plan, index) => (
        <PriceCard
          id={plan.id}
          key={index}
          name={plan.name}
          price={plan.price}
          interval={plan.interval}
          description={plan.description}
        />
      ))}
    </div>
  );
}
