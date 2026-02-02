"use client";

import { useEffect, useState } from "react";
import type { WeatherType } from "../../types/weather-types";

type Props = {
  city: string;
};

export default function WeatherClient({ city }: Props) {
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [fetchTime, setFetchTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://weather.lexlink.se/forecast/location/${encodeURIComponent(city)}`,
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Location "${city}" not found`);
          }
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeather(data);
        setFetchTime(new Date().toLocaleTimeString());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      }
    }

    fetchWeather();
  }, [city]);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!weather) {
    return <p>Loading weather…</p>;
  }

  return (
    <div>
      <p>Last updated: {fetchTime}</p>
      <pre>{JSON.stringify(weather, null, 2)}</pre>
    </div>
  );
}
