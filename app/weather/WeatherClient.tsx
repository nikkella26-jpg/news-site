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
          process.env.NEXT_PUBLIC_WEATHER_API_URL ||
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
        setWeather(data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Request was aborted
        }
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();

    return () => {
      controller.abort();
    };
  }, [city]);

  return (
    <div>
      {loading && <p>Loading weather data...</p>}
      {error && <p>Error: {error}</p>}
      {weather && (
        <div>
          <h2>Weather in {city}</h2>
          <pre>{JSON.stringify(weather, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
