"use server";

import { WeatherType } from "@/types/weather-types";
import { fetchWeatherByLocation } from "@/lib/weather";

export async function getWeatherByLocation(
  location: string,
): Promise<WeatherType> {
  return fetchWeatherByLocation(location);
}
