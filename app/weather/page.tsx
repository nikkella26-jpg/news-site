import { getWeatherByLocation } from "@/services/weather/weatherService";

export default async function Page() {
  const weather = await getWeatherByLocation("Linköping");

  if (!weather) {
    return <div>Failed to load weather data. Please try again later.</div>;
  }

  return <pre>{JSON.stringify(weather, null, 2)}</pre>;
}
