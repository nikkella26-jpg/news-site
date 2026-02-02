"use client";

import { useEffect, useRef, useState } from "react";
import type { WeatherType } from "../../types/weather-types";

type Props = {
  city: string;
};

export default function WeatherClient({ city }: Props) {
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const currentRequestId = ++requestIdRef.current;

    async function fetchWeather() {
      setLoading(true);
      setError(null);

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
        if (currentRequestId === requestIdRef.current) {
          setWeather(data);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Request was aborted
        }
        if (currentRequestId === requestIdRef.current) {
          setError(err instanceof Error ? err.message : "Unexpected error");
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
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
