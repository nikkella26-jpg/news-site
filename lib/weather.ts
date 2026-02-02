import { WeatherType } from "@/types/weather-types";

export async function fetchWeatherByLocation(
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
  return await response.json();
}
