"use client";

import { useEffect, useState, useMemo } from "react";
import WeatherClient from "./WeatherClient";
import { adaptWeatherToWeek } from "./adaptWeatherToWeek";
import { adaptWeatherToTimeSlots, type AdaptedTimeSlot } from "./adaptWeatherToTimeSlots";
import type { WeatherType } from "@/types/weather-types";

const DEFAULT_CITY = "Stockholm";

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
};

type NominatimResponse = {
  address?: NominatimAddress;
};

export default function WeatherPage() {
  const [city, setCity] = useState<string>(DEFAULT_CITY);
  const [locationResolved, setLocationResolved] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherType | null>(null);
  const [timeSlots, setTimeSlots] = useState<AdaptedTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect user location and reverse geocode it
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationResolved(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const nominatimApiUrl = process.env.NEXT_PUBLIC_NOMINATIM_API_URL || "https://nominatim.openstreetmap.org";
          const response = await fetch(
            `${nominatimApiUrl}/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "Accept-Language": "en", "User-Agent": "WeatherApp/1.0" } }
          );
          if (!response.ok) {
            throw new Error(`Nominatim request failed with status ${response.status}`);
          }
          const data: NominatimResponse = await response.json();
          if (!data?.address || typeof data.address !== "object") {
            throw new Error("Nominatim response does not contain a valid address object");
          }
          const { address } = data;
          const resolvedCity =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            DEFAULT_CITY;
          setCity(resolvedCity);
        } catch (err) {
          console.error("Reverse geocoding failed, falling back to Stockholm:", err);
        } finally {
          setLocationResolved(true);
        }
      },
      () => {
        // User denied or error occurred
        setLocationResolved(true);
      }
    );
  }, []);

  // Fetch weather data only after location is resolved to prevent double-fetch
  useEffect(() => {
    if (!locationResolved) return;

    const controller = new AbortController();

    async function fetchWeatherData() {
      setLoading(true);
      setError(null);

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL?.replace(
          /\/+$/,
          "",
        );

        if (!apiBaseUrl) {
          throw new Error("Weather API URL is not configured in environment variables.");
        }

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
  }, [city, locationResolved]);

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
