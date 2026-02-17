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

const DEFAULT_CITY = "Linköping";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [city, setCity] = useState<string>(DEFAULT_CITY);

  // Get user's location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      return; // Geolocation not supported, use default city
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocode using OpenStreetMap Nominatim API
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                "User-Agent": "NewsWeatherWidget/1.0",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const detectedCity =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.municipality ||
              DEFAULT_CITY;
            setCity(detectedCity);
          }
        } catch (error) {
          console.error("Failed to reverse geocode location:", error);
          // Keep using default city
        }
      },
      (error) => {
        console.warn("Geolocation permission denied or failed:", error.message);
        // Keep using default city
      },
      {
        timeout: 5000,
        maximumAge: 300000, // Cache position for 5 minutes
      }
    );
  }, []);

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
          `${apiBaseUrl}/forecast/location/${city}`,
          { signal: controller.signal },
        );

        if (!response.ok) return;

        const data: WeatherType = await response.json();
        const now = data.timeseries?.[0];
        if (!now) return;

        setWeather({
          temp: Math.round(now.temp),
          summary: now.summary,
          city: city,
        });
      } catch {
        // Intentionally silent — navbar widgets should never shout
      }
    }

    fetchWeather();
    return () => controller.abort();
  }, [city]);

  if (!weather) return null;

  return (
    <Button variant={"secondary"} asChild>
      <Link
        href="/weather"
        className="
        flex justify-items-center  gap-2
        rounded-full
        backdrop-blur-sm
        px-3 py-1.5
        text-sm
        transition
      "
        aria-label="View detailed weather forecast"
      >
        <span>
          {city}: {conditionIcon(weather.summary)}
        </span>
        <span className="font-medium">{weather.temp}°</span>
      </Link>
    </Button>
  );
}
