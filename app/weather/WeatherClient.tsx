"use client";

import { useEffect, useState } from "react";
import type { WeatherType } from "../../types/weather-types";
import { format } from "date-fns";
import { WeeklyForecastCard } from "@/components/WeeklyForecastCard";
import {
  Wind,
  Droplets,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudSun
} from "lucide-react";

type WeatherClientProps = {
  city: string;
};

type HourlyCardProps = {
  time: string;
  airTemp: number;
  windSpeed: number;
  condition: string;
  humidity: number;
};

export default function WeatherClient({ city }: WeatherClientProps) {
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      try {
        if (!process.env.NEXT_PUBLIC_WEATHER_API_URL) {
          throw new Error(
            "Please set NEXT_PUBLIC_WEATHER_API_URL in your .env",
          );
        }

        const apiBaseUrl =
          process.env.NEXT_PUBLIC_WEATHER_API_URL.replace(/\/+$/, "");

        const response = await fetch(
          `${apiBaseUrl}/forecast/location/${encodeURIComponent(city)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Location "${city}" not found`);
          }
          throw new Error("Failed to fetch weather data");
        }

        const data: WeatherType = await response.json();

        if (!Array.isArray(data.timeseries)) {
          throw new Error("Unexpected weather data format");
        }

        setWeather(data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();
    return () => controller.abort();
  }, [city]);

  /* ───────────────────────── UI ───────────────────────── */

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600">
        Loading weather data…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <section className="pt-10 pb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Weather in {city}
        </h1>
        <p className="mt-1 text-slate-600">Hourly forecast for the next 24 hours</p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {weather.timeseries.slice(0, 24).map((entry) => (
          <HourlyWeatherCard
            key={entry.validTime}
            time={entry.validTime}
            airTemp={entry.temp}
            windSpeed={entry.windSpeed}
            condition={entry.summary}
            humidity={entry.humidity}
          />
        ))}
      </section>
    </div>
  );
}

function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  const s = condition.toLowerCase();
  if (s.includes("rain")) return <CloudRain className={className} />;
  if (s.includes("snow")) return <CloudSnow className={className} />;
  if (s.includes("thunder") || s.includes("lightning")) return <CloudLightning className={className} />;
  if (s.includes("cloud")) {
    if (s.includes("partly") || s.includes("broken")) return <CloudSun className={className} />;
    return <Cloud className={className} />;
  }
  if (s.includes("sun") || s.includes("clear")) return <Sun className={className} />;
  return <CloudSun className={className} />;
}

function HourlyWeatherCard({
  time,
  airTemp,
  windSpeed,
  condition,
  humidity,
}: HourlyCardProps) {
  const hour = format(new Date(time), "HH:00");
  const isNow = new Date().getHours() === new Date(time).getHours() &&
    new Date().getDate() === new Date(time).getDate();

  return (
    <div className={`
      relative overflow-hidden
      flex flex-col items-center p-4 rounded-2xl
      transition-all duration-300 hover:scale-105
      ${isNow
        ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-200"
        : "bg-white/80 backdrop-blur-md border border-slate-100 text-slate-700 shadow-sm hover:shadow-md"}
    `}>
      <span className={`text-xs font-medium uppercase tracking-wider mb-3 ${isNow ? "text-blue-50" : "text-slate-400"}`}>
        {isNow ? "Now" : hour}
      </span>

      <div className="mb-4">
        <WeatherIcon
          condition={condition}
          className={`w-10 h-10 ${isNow ? "text-white" : "text-cyan-500"}`}
        />
      </div>

      <div className="flex flex-col items-center mb-4">
        <span className="text-2xl font-bold">{Math.round(airTemp)}°</span>
        <span className={`text-[10px] text-center line-clamp-1 h-3 ${isNow ? "text-blue-100" : "text-slate-400"}`}>
          {condition}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full pt-3 border-t border-slate-100/20">
        <div className="flex flex-col items-center gap-1">
          <Wind className={`w-3 h-3 ${isNow ? "text-blue-200" : "text-slate-400"}`} />
          <span className="text-[10px] font-medium">{Math.round(windSpeed)}<span className="opacity-70 ml-0.5">m/s</span></span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Droplets className={`w-3 h-3 ${isNow ? "text-blue-200" : "text-slate-400"}`} />
          <span className="text-[10px] font-medium">{Math.round(humidity)}<span className="opacity-70 ml-0.5">%</span></span>
        </div>
      </div>
    </div>
  );
}
