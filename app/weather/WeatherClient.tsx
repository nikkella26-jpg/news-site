"use client";

import { useEffect, useState } from "react";
import type { WeatherType } from "@/types/weather-types";
import {
  adaptWeatherToTimeSlots,
  type AdaptedTimeSlot,
} from "./adaptWeatherToTimeSlots";
import { adaptWeatherToWeek } from "./adaptWeatherToWeek";

type WeatherClientProps = {
  city: string;
};

const conditionIcon = (summary: string) => {
  const s = summary.toLowerCase();

  if (s.includes("rain")) return "🌧️";
  if (s.includes("cloud")) return "☁️";
  if (s.includes("snow")) return "❄️";
  if (s.includes("clear") || s.includes("sun")) return "☀️";
  if (s.includes("storm")) return "⛈️";

  return "🌤️";
};

export default function WeatherClient({ city }: WeatherClientProps) {
  const [timeSlots, setTimeSlots] = useState<AdaptedTimeSlot[]>([]);
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

        const data: WeatherType = await response.json();

        if (!Array.isArray(data.timeseries)) {
          throw new Error("Unexpected weather data format");
        }

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
  }, [city]);

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

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today */}
        <div className="border-[6px] border-yellow-500 p-1.5 rounded-2xl bg-white/70 backdrop-blur-sm">
          <section className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Today’s Forecast
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {timeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className="rounded-xl bg-white border border-slate-100 p-4 text-center"
                >
                  <div className="text-sm text-slate-500">{slot.time}</div>

                  <div className="text-2xl">
                    {conditionIcon(slot.condition)}
                  </div>

                  <div className="text-lg font-semibold">{slot.avgTemp}°</div>

                  <div className="text-xs text-slate-600">{slot.condition}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Weekly */}
        <div className="border-[6px] border-yellow-500 p-1.5 rounded-2xl bg-white/70 backdrop-blur-sm">
          <section className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Weekly Forecast
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {weekly.map((day) => (
                <div
                  key={day.date}
                  className="rounded-xl bg-white border border-slate-100 p-4 text-center"
                >
                  <div className="text-sm font-medium text-slate-600">
                    {day.dayLabel}
                  </div>

                  <div className="text-2xl">{conditionIcon(day.condition)}</div>

                  <div className="text-sm font-semibold">
                    {day.minTemp}° / {day.maxTemp}°
                  </div>

                  <div className="text-xs text-slate-600">{day.condition}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
