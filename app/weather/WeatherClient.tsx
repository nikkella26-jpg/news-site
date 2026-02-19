"use client";

import { useEffect, useState } from "react";

import { WeeklyForecastCard } from "@/components/WeeklyForecastCard";

import { adaptWeatherToTimeSlots } from "./adaptWeatherToTimeSlots";
import { adaptWeatherToWeek } from "./adaptWeatherToWeek";

type WeatherClientProps = {
  city: string;
};

export default function WeatherClient({
  city: initialCity,
}: WeatherClientProps) {
  const [city, setCity] = useState(initialCity);
  const [timeSlots, setTimeSlots] = useState<
    ReturnType<typeof adaptWeatherToTimeSlots>
  >([]);
  const [weekly, setWeekly] = useState<ReturnType<typeof adaptWeatherToWeek>>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationResolved, setLocationResolved] = useState(false);

  // Resolve user's geolocation (if available)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationResolved(true);
      return;
    }

    const timeout = setTimeout(() => setLocationResolved(true), 5000);

    navigator.geolocation.getCurrentPosition(
      () => {
        // TODO: Convert coordinates to city name if desired
        // For now, just mark location as resolved and use initial city
        setLocationResolved(true);
        clearTimeout(timeout);
      },
      () => {
        // Geolocation denied or error
        setLocationResolved(true);
        clearTimeout(timeout);
      },
    );

    return () => clearTimeout(timeout);
  }, []);

  // Fetch weather only after location is resolved
  useEffect(() => {
    if (!locationResolved) {
      return;
    }

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
        setTimeSlots(adaptWeatherToTimeSlots(data.timeseries));
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
  }, [city, locationResolved]);

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
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {timeSlots.map((slot) => (
          <div
            key={slot.slot}
            className="rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100"
          >
            {/* Add weather slot content here */}
          </div>
        ))}
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
