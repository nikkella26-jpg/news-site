import React from "react";

interface EnvironmentalMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
}

export default function EnvironmentalMetric({
  label,
  value,
  unit,
  icon,
}: EnvironmentalMetricProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/20">
      <div className="flex items-center justify-center">{icon}</div>
      <div className="text-center">
        <div className="text-2xl font-bold text-slate-900">
          {value}
          {unit}
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}
