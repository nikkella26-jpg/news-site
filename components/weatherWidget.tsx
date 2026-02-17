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

export default function WeatherWidget({ location }: { location: string }) {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  const encodedLocation = encodeURIComponent(location);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      try {
        if (!process.env.NEXT_PUBLIC_WEATHER_API_URL) return;

        const apiBaseUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL.replace(
          /\/+$/,
          "",
        );

        const response = await fetch(
          `${apiBaseUrl}/forecast/location/${encodedLocation}`,
          { signal: controller.signal },
        );

        if (!response.ok) return;

        const data: WeatherType = await response.json();
        const now = data.timeseries?.[0];
        if (!now) return;

        setWeather({
          temp: Math.round(now.temp),
          summary: now.summary,
          city: location,
        });
      } catch {
        // Intentionally silent — navbar widgets should never shout
      }
    }

    fetchWeather();
    return () => controller.abort();
  }, [encodedLocation, location]);

  if (!weather) return null;

  return (
    <Button variant={"secondary"} asChild>
      <Link
        href="/weather"
        className="
         flex items-center gap-2
          rounded-full
          backdrop-blur-sm
          px-4 py-2
          text-base
          font-medium
          transition  
          "
        aria-label="View detailed weather forecast"
      >
        <span>
          {location}: {conditionIcon(weather.summary)}
        </span>

        <span className="font-medium">{weather.temp}°</span>
      </Link>
    </Button>
  );
}
