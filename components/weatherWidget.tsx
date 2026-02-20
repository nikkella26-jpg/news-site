"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { WeatherType } from "../types/weather-types";
import { Button } from "./ui/button";

type WeatherSnapshot = {
  city: string;
  temp: number;
  summary: string;
};

const conditionIcon = (summary: string) => {
  const s = summary.toLowerCase();

  if (s.includes("rain")) return "🌧️";
  if (s.includes("cloud")) return "☁️";
  if (s.includes("snow")) return "❄️";
  if (s.includes("full moon")) return "🌕";
  if (s.includes("sun") || s.includes("clear")) return "☀️";

  return "🌤️";
};

const DEFAULT_LOCATION = "Stockholm";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [location, setLocation] = useState<string>(DEFAULT_LOCATION);

  useEffect(() => {
    // Try to get user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const nominatimApiUrl =
              process.env.NEXT_PUBLIC_NOMINATIM_API_URL ||
              "https://nominatim.openstreetmap.org";
            const response = await fetch(
              `${nominatimApiUrl}/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              { headers: { "Accept-Language": "en" } },
            );
            const data = await response.json();
            const resolvedCity =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.municipality ||
              DEFAULT_LOCATION;
            setLocation(resolvedCity);
          } catch (err) {
            console.error("Widget reverse geocoding failed:", err);
            setLocation(DEFAULT_LOCATION);
          }
        },
        () => {
          // If geolocation denied, keep Stockholm
          setLocation(DEFAULT_LOCATION);
        },
      );
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      try {
        const apiBaseUrl = (
          process.env.NEXT_PUBLIC_WEATHER_API_URL || ""
        ).replace(/\/+$/, "");

        if (!apiBaseUrl) {
          if (process.env.NODE_ENV === "development") {
            console.warn("WeatherWidget: NEXT_PUBLIC_WEATHER_API_URL is not configured.");
          }
          return;
        }

        const encodedLocation = encodeURIComponent(location);

        const response = await fetch(
          `${apiBaseUrl}/forecast/location/${encodedLocation}`,
          { signal: controller.signal },
        );

        if (!response.ok) return;

        const data: WeatherType = await response.json();

        // Find best match for current hour
        const now = new Date();
        const nowHour = now.getHours();
        const nowDay = now.toISOString().slice(0, 10);

        let bestMatch = data.timeseries?.[0];
        if (data.timeseries) {
          const todaysEntries = data.timeseries.filter((e) =>
            e.validTime.startsWith(nowDay),
          );
          if (todaysEntries.length > 0) {
            bestMatch = todaysEntries.reduce((prev, curr) => {
              const prevHour = new Date(prev.validTime).getHours();
              const currHour = new Date(curr.validTime).getHours();
              return Math.abs(currHour - nowHour) < Math.abs(prevHour - nowHour)
                ? curr
                : prev;
            });
          }
        }

        if (!bestMatch) return;

        setWeather({
          temp: Math.round(bestMatch.temp),
          summary: bestMatch.summary,
          city: location,
        });
      } catch (err) {
        // Ignore expected aborts from cleanup (location change/unmount)
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error(`WeatherWidget: Fetch failed for ${location}:`, err);
        // Intentionally silent — navbar widgets should never shout
      }
    }

    fetchWeather();
    return () => controller.abort();
  }, [location]);

  if (!weather) return null;

  return (
    <Button
      variant={"secondary"}
      asChild
      className="h-auto p-0 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <Link
        href="/weather"
        className="
          flex items-center gap-10
          rounded-xl
          backdrop-blur-sm
          px-10 py-1.5
          text-base
          font-semibold
          transition-all
          hover:scale-[1.01]
          active:scale-[0.99]
          bg-white/10
          border border-white/20
          "
        aria-label="View detailed weather forecast"
      >
        <div className="flex flex-col items-start leading-[1.1] py-0.5">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            {location}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-lg">{conditionIcon(weather.summary)}</span>
            <span className="text-sm text-slate-700 dark:text-slate-200 font-medium capitalize whitespace-nowrap">
              {weather.summary}
            </span>
          </div>
        </div>

        <div
          className="w-px h-6 bg-slate-200 dark:bg-slate-700"
          aria-hidden="true"
        />

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tighter">
            {weather.temp}°
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
            C
          </span>
        </div>
      </Link>
    </Button>
  );
}
