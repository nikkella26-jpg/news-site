"use server";

import { WeatherType } from "@/types/weather-types";

export async function getWeatherByLocation(
  location: string,
): Promise<WeatherType> {
  const response = await fetch(
    `https://weather.lexlink.se/forecast/location/${location}`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch weather data: ${response.status} ${response.statusText}`,
    );
  }
  const result = await response.json();
  return result;
}
