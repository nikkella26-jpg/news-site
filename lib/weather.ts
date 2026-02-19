import { WeatherType } from "@/types/weather-types";

export async function fetchWeatherByLocation(
  location: string,
): Promise<WeatherType> {
  // Encode the location to ensure the URL is valid
  const encodedLocation = encodeURIComponent(location);

  const apiBaseUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL?.replace(
    /\/+$/,
    "",
  );

  if (!apiBaseUrl) {
    throw new Error(
      "Weather API URL is not configured in environment variables.",
    );
  }

  const response = await fetch(
    `${apiBaseUrl}/forecast/location/${encodedLocation}`,
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
