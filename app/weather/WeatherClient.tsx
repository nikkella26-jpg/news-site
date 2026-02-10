"use client";

import { adaptWeatherToTimeSlots } from "./adaptWeatherToTimeSlots";
import { adaptWeatherToWeek } from "./adaptWeatherToWeek";
import SixHourlyForecastGrid from "../../components/sixHourlyForecastGrid";

import { useEffect, useState } from "react";

import { WeeklyForecastCard } from "@/components/WeeklyForecastCard";

type TimeSlot = {
  time: string;
  temp: number;
  condition?: string;
};

type WeatherClientProps = {
  city: string;
};

export default function WeatherClient({ city }: WeatherClientProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [weekly, setWeekly] = useState<ReturnType<typeof adaptWeatherToWeek>>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      try {
        if (!process.env.NEXT_PUBLIC_WEATHER_API_URL) {
          throw new Error(
            "Please set NEXT_PUBLIC_WEATHER_API_URL in your .env file",
          );
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL.replace(
          /\/+$/,
          "",
        );

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

        const data = await response.json();

        if (!Array.isArray(data.timeseries)) {
          throw new Error("Unexpected weather data format");
        }

        // 🔑 ADAPT DATA HERE — single source of truth
        setTimeSlots(
          adaptWeatherToTimeSlots(data.timeseries) as unknown as TimeSlot[],
        );
        setWeekly(adaptWeatherToWeek(data.timeseries));
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

  /* ───────────────────────── UI STATES ───────────────────────── */

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600">
        Loading weather data…
      </div>
    );
  }

  if (error) {
    return <div className="py-20 text-center text-red-600">{error}</div>;
  }

  if (timeSlots.length === 0) return null;

  /* ───────────────────────── RENDER ───────────────────────── */

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {/* Header */}
      <section className="pt-10 pb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Weather in {city}
        </h1>
        <p className="mt-1 text-slate-600">Today’s forecast</p>
      </section>

      {/* Today – 4 time slots */}
      <section>
        <SixHourlyForecastGrid forecasts={timeSlots} />
      </section>

      {/* Weekly forecast */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          7-Day Forecast
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
          {weekly.map((day, index) => (
            <WeeklyForecastCard
              key={index}
              dayLabel={day.dayLabel}
              minTemp={day.minTemp}
              maxTemp={day.maxTemp}
              condition={day.condition}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
