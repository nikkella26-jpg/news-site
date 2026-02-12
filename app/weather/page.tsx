import { notFound } from "next/navigation";
import WeatherClient from "./WeatherClient";
import { adaptWeatherToWeek } from "./adaptWeatherToWeek";
import { generateWeeklyWeatherSummary } from "@/lib/ai";

type WeatherErrorProps = {
  city: string;
  message: string;
};

function WeatherError({ city, message }: WeatherErrorProps) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div
        className="
        fixed inset-0 -z-20
        bg-gradient-to-b
        from-slate-200
        via-cyan-100
        to-stone-100
        "
      />
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-800 mb-4">
            Weather in {city}
          </h1>
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}

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

  let response;
  try {
    response = await fetch(
      `${apiBaseUrl}/forecast/location/${encodeURIComponent(city)}`,
      { cache: "no-store" },
    );
  } catch {
    return (
      <WeatherError
        city={city}
        message="Unable to connect to weather service. Please try again later."
      />
    );
  }

  // Handle 404 - city not found
  if (response.status === 404) {
    notFound();
  }

  // Handle other HTTP errors
  if (!response.ok) {
    return (
      <WeatherError
        city={city}
        message={`Unable to fetch weather data (Error ${response.status}). Please try again later.`}
      />
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    return (
      <WeatherError
        city={city}
        message="Received invalid weather data. Please try again later."
      />
    );
  }

  if (!Array.isArray(data.timeseries)) {
    return (
      <WeatherError
        city={city}
        message="Unexpected weather data format. Please try again later."
      />
    );
  }

  const weekly = adaptWeatherToWeek(data.timeseries);

  let summary;
  try {
    summary = await generateWeeklyWeatherSummary(city, weekly);
  } catch {
    // If AI summary fails, use a fallback
    summary = `Weather forecast for ${city} - ${weekly.length} days available`;
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div
        className="
        fixed inset-0 -z-20
        bg-gradient-to-b
        from-slate-200
        via-cyan-100
        to-stone-100
        "
      />
      <WeatherClient city={city} weekly={weekly} summary={summary} />
    </div>
  );
}
