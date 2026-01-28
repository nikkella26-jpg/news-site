import { getWeatherByLocation } from "@/actions/weather";

export default async function Page() {
  try {
    const weather = await getWeatherByLocation("Linköping");
    return (
      <div>
        <pre>{JSON.stringify(weather, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Failed to load weather data. Please try again later.</div>;
  }
}
