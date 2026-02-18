"use client";

import { useEffect, useState, useMemo } from "react";
import WeatherClient from "./WeatherClient";
import { adaptWeatherToWeek } from "./adaptWeatherToWeek";
import { adaptWeatherToTimeSlots, type AdaptedTimeSlot } from "./adaptWeatherToTimeSlots";
import type { WeatherType } from "@/types/weather-types";

const DEFAULT_CITY = "Stockholm";

export default function WeatherPage() {
  const [city, setCity] = useState<string>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherType | null>(null);
  const [timeSlots, setTimeSlots] = useState<AdaptedTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect user location and reverse geocode it
  useEffect(() => {
    if (!navigator.geolocation) {
      setCity(DEFAULT_CITY);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding using Nominatim (free, no key required for low volume)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await response.json();
          const resolvedCity = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || DEFAULT_CITY;
          setCity(resolvedCity);
        } catch (err) {
          console.error("Reverse geocoding failed, falling back to Stockholm:", err);
          setCity(DEFAULT_CITY);
        }
      },
      () => {
        // User denied or error occurred
        setCity(DEFAULT_CITY);
      }
    );
  }, []);

  // Fetch weather data based on city
  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeatherData() {
      // Don't fetch until we have a determined city (or if it's still Stockholm)
      setLoading(true);
      setError(null);

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL?.replace(
          /\/+$/,
          "",
        ) || "https://weather.lexlink.se";

        const response = await fetch(
          `${apiBaseUrl}/forecast/location/${encodeURIComponent(city)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data: WeatherType = await response.json();
        setWeatherData(data);

        if (data.timeseries) {
          setTimeSlots(adaptWeatherToTimeSlots(data.timeseries));
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(
          err instanceof Error ? err.message : "Failed to load weather data",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
    return () => controller.abort();
  }, [city]);

  const weekly = useMemo(() => {
    if (!weatherData?.timeseries) return [];
    return adaptWeatherToWeek(weatherData.timeseries);
  }, [weatherData?.timeseries]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600">Loading weather data…</p>
      </div>
    );
  }

  if (error || !weatherData || !weatherData.timeseries) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-red-600">
          {error || "Failed to load weather data. Please try again later."}
        </p>
        <p className="text-slate-600 mt-2">
          Make sure location permissions are enabled or try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <WeatherClient
      city={city}
      weekly={weekly}
      timeSlots={timeSlots}
    />
  );
}
