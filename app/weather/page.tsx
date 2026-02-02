import { fetchWeatherByLocation } from "@/lib/weather";

export default async function Page() {
  try {
    const weather = await fetchWeatherByLocation("Linköping");
    return <pre>{JSON.stringify(weather, null, 2)}</pre>;
  } catch (error) {
    console.error(error);
    return <div>Failed to load weather data.</div>;
  }
}
