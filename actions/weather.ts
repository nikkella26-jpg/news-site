"use server";

import { WeatherType } from "@/types/weather-types";

export async function getWeatherByLocation(
  location: string,
): Promise<WeatherType> {
  const response = await fetch(
    `https://weather.lexlink.se/forecast/location/${location}`,
  );
  const result = await response.json();
  return result;
}
