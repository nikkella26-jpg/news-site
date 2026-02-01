"use client";

import { useState, useEffect, useCallback } from "react";
import { Weather } from "../types/weather-types";

import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  HelpCircle,
  Droplets,
  Wind,
  Eye,
} from "lucide-react";

import { deriveInsights } from "../lib/insights";
import EnvironmentalMetric from "./EnvironmentalMetric";

const CONDITION_ICON_STYLE = "w-8 h-8";
const METRIC_ICON_STYLE = "w-6 h-6 text-slate-600/80";
const ICON_STROKE = 1.5;

function getConditionIcon(summary?: string) {
  const text = summary?.toLowerCase() ?? "";

  if (text.includes("sun") || text.includes("clear")) {
    return (
      <Sun
        className={`${CONDITION_ICON_STYLE} text-amber-500`}
        strokeWidth={ICON_STROKE}
      />
    );
  }

  if (text.includes("rain") || text.includes("drizzle")) {
    return (
      <CloudRain
        className={`${CONDITION_ICON_STYLE} text-blue-500`}
        strokeWidth={ICON_STROKE}
      />
    );
  }

  if (
    text.includes("snow") ||
    text.includes("sleet") ||
    text.includes("hail")
  ) {
    return (
      <CloudSnow
        className={`${CONDITION_ICON_STYLE} text-blue-300`}
        strokeWidth={ICON_STROKE}
      />
    );
  }

  if (
    text.includes("thunder") ||
    text.includes("storm") ||
    text.includes("lightning")
  ) {
    return (
      <CloudLightning
        className={`${CONDITION_ICON_STYLE} text-purple-500`}
        strokeWidth={ICON_STROKE}
      />
    );
  }

  if (text.includes("fog") || text.includes("mist") || text.includes("haze")) {
    return (
      <CloudFog
        className={`${CONDITION_ICON_STYLE} text-slate-400`}
        strokeWidth={ICON_STROKE}
      />
    );
  }

  if (text.includes("cloud")) {
    return (
      <Cloud
        className={`${CONDITION_ICON_STYLE} text-slate-500`}
        strokeWidth={ICON_STROKE}
      />
    );
  }

  return (
    <HelpCircle
      className={`${CONDITION_ICON_STYLE} text-slate-400`}
      strokeWidth={ICON_STROKE}
    />
  );
}

export default function WeatherComponent() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [location, setLocation] = useState("Linköping");
  const [error, setError] = useState<string | null>(null);
  const [fetchTime, setFetchTime] = useState<string>("");

  const insights = weather ? deriveInsights(weather) : null;

  const handleSubmit = useCallback(
    async (e?: React.FormEvent, manualLocation?: string) => {
      e?.preventDefault();
      setError(null);

      const targetCity = (manualLocation || location).trim();
      if (!targetCity) {
        setError("Invalid location");
        return;
      }

      try {
        const response = await fetch(
          `https://weather.lexlink.se/forecast/location/${encodeURIComponent(
            targetCity,
          )}`,
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Location "${targetCity}" not found`);
          }
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeather(data);
        setFetchTime(new Date().toLocaleTimeString());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      }
    },
    [location],
  );

  useEffect(() => {
    handleSubmit(undefined, "Linköping");
    const timer = setTimeout(() => setLocation(""), 100);
    return () => clearTimeout(timer);
  }, [handleSubmit]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Background */}

      <div className="fixed inset-0 -z-20 bg-linear-to-b from-teal-100 via-cyan-50 to-stone-100" />

      {weather && (
        <div className="overflow-hidden rounded-3xl bg-white/40 shadow-2xl backdrop-blur-2xl border border-white/30">
          <div className="p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                  {weather.location.name}
                </h3>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Lat: {weather.location.lat}</span>
                  <span>Lon: {weather.location.lon}</span>
                </div>
              </div>

              <div className="text-8xl font-black tracking-tighter text-slate-800">
                {weather.timeseries[0].temp}°C
              </div>
            </div>

            {/* Environmental Metrics */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <EnvironmentalMetric
                label="Condition"
                value={weather.timeseries[0].summary}
                icon={getConditionIcon(weather.timeseries[0].summary)}
              />

              <EnvironmentalMetric
                label="Humidity"
                value={weather.timeseries[0].humidity}
                unit="%"
                icon={
                  <Droplets
                    className={METRIC_ICON_STYLE}
                    strokeWidth={ICON_STROKE}
                  />
                }
              />

              <EnvironmentalMetric
                label="Wind"
                value={weather.timeseries[0].windSpeed}
                unit="m/s"
                icon={
                  <Wind
                    className={METRIC_ICON_STYLE}
                    strokeWidth={ICON_STROKE}
                  />
                }
              />

              <EnvironmentalMetric
                label="Visibility"
                value={weather.timeseries[0].visibility}
                unit="km"
                icon={
                  <Eye
                    className={METRIC_ICON_STYLE}
                    strokeWidth={ICON_STROKE}
                  />
                }
              />
            </div>

            {insights?.weeklyOutlook && (
              <div className="mt-10">
                <details className="group rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-sm">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-[16px] font-bold text-slate-700 hover:bg-white/60 transition-colors">
                    <span className="tracking-wide">
                      Weekly Planning Outlook
                    </span>

                    <span className="text-slate-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>

                  <div className="px-6 pb-5 pt-3 text-[16px] font-bold text-slate-600 leading-relaxed">
                    {insights.weeklyOutlook}
                  </div>
                </details>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Station Status: Operational</span>
              <span>Last Updated: {fetchTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mt-4 flex flex-col items-center gap-3 w-full">
        {error && (
          <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">
            {error}
          </p>
        )}
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-50">
          Enter city name or coordinates
        </p>

        <form onSubmit={handleSubmit} className="relative w-full max-w-md">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search city..."
            className="w-full bg-blue-50/80 backdrop-blur-md border border-slate-900/20 focus:border-slate-900/30 focus:bg-white p-5 pr-32 rounded-3xl text-slate-900 font-bold placeholder:text-slate-400 shadow-xl transition-all outline-hidden text-center"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-slate-400/70 text-slate-900 px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-400/90 active:scale-95 transition-all shadow-lg"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
