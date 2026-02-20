import { WeatherType } from "@/types/weather-types";

export async function fetchWeatherByLocation(
  location: string,
  options?: RequestInit,
): Promise<WeatherType> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL?.replace(/\/+$/, "") || "";
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_WEATHER_API_URL is not defined");
  }
  const encodedLocation = encodeURIComponent(location);

  const response = await fetch(
    `${apiBaseUrl}/forecast/location/${encodedLocation}`,
    options
  );

  // Check if the response is not OK
  if (!response.ok) {
    throw new Error(
      `Failed to fetch weather data for location "${location}": ${response.status} ${response.statusText}`,
    );
  }

  try {
    // Parse the JSON response
    const data: WeatherType = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      `Failed to parse weather data for location "${location}": ${error}`,
    );
  }
}
