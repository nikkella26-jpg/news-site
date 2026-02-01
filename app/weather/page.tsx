import { getWeatherByLocation } from "@/actions/weather";

export default async function Page() {
  const weather = await getWeatherByLocation("Linköping");
  return (
    <div>
      <pre>{JSON.stringify(weather, null, 2)}</pre>
    </div>
  );
}
