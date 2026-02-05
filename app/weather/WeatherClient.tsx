"use client";

import { useEffect, useState } from "react";
import type { WeatherType } from "../../types/weather-types";

type Props = {
  city: string;
};

export default function WeatherClient({ city }: Props) {
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError(null);
      setWeather(null);

      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_WEATHER_API_URL ??
          "https://weather.lexlink.se";

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

        if (!controller.signal.aborted) {
          setWeather(data);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unexpected error");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    const now = weather
      ? (weather.timeseries.find((t) => new Date(t.validTime) >= new Date()) ??
        weather.timeseries[0])
      : null;


    fetchWeather();

    return () => controller.abort();
  }, [city]);

  return (
    <div className="relative">
      {/* Loading state */}
      {loading && (
        <div className="max-w-6xl mx-auto px-4 py-20">
          <p className="text-center text-slate-600">Loading weather data…</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 py-20">
          <p className="text-center text-red-600">{error}</p>
        </div>
      )}

      {/* Weather content */}
      {weather && !loading && (
        <div className="max-w-6xl mx-auto px-4 pb-20">
          {/* Header */}
          <section className="pt-10 pb-6">
            <h1 className="text-2xl font-semibold text-slate-800">
              Weather in {city}
            </h1>
            <p className="mt-1 text-slate-600">Hourly forecast</p>
          </section>

          {/* Forecast grid */}
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {weather.timeseries.slice(0, 24).map((time) => (
                <div
                  key={time.validTime}
                  className="
                    rounded-2xl
                    bg-white/55
                    backdrop-blur-sm
                    border border-white/40
                    shadow-sm shadow-slate-900/5
                    p-4
                    text-center
                  "
                >
                  <p className="text-xs text-slate-500 tracking-wide">
                    {new Date(time.validTime).toLocaleString("sv-SE", {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-slate-800">
                    {Math.round(time.temp)}°
                  </p>

                  <p className="mt-1 text-xs text-slate-600">{time.summary}</p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Humidity {time.humidity}%
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
