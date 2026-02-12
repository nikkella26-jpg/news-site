import WeatherClient from "./WeatherClient";
import { adaptWeatherToWeek } from "./adaptWeatherToWeek";
import { generateWeeklyWeatherSummary } from "@/lib/ai";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const params = await searchParams;

  const city = typeof params.city === "string" ? params.city : "Linköping";

  const apiBaseUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL?.replace(
    /\/+$/,
    "",
  );

  if (!apiBaseUrl) {
    throw new Error("Weather API URL missing");
  }

  const response = await fetch(
    `${apiBaseUrl}/forecast/location/${encodeURIComponent(city)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  if (!Array.isArray(data.timeseries)) {
    throw new Error("Unexpected weather data format");
  }

  const weekly = adaptWeatherToWeek(data.timeseries);

  const summary = await generateWeeklyWeatherSummary(city, weekly);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div
        className="
        fixed inset-0 -z-20
        bg-linear-to-b
        from-slate-200
        via-cyan-100
        to-stone-100
        "
      />
      <WeatherClient city={city} weekly={weekly} summary={summary} />
    </div>
  );
}
