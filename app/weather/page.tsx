import WeatherClient from "./WeatherClient";
import { fetchWeatherByLocation } from "@/lib/weather";
import { adaptWeatherToWeek } from "./adaptWeatherToWeek";
import { headers } from "next/headers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Weather Forecast",
  description: "Get accurate, real-time weather forecasts and weekly outlooks for your city. Nordic Express Weather keeps you prepared.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city: queryCity } = await searchParams;

  // Detect city from header if not in query
  const headerList = await headers();
  const ipCity = headerList.get("x-vercel-ip-city");

  const city = queryCity || (ipCity ? decodeURIComponent(ipCity) : "Stockholm");

  const data = await fetchWeatherByLocation(city);

  if (!data || !Array.isArray(data.timeseries)) {
    return (
      <div className="flex flex-col gap-8 w-full py-10 text-center">
        <h1 className="text-2xl font-bold">Weather data not available</h1>
      </div>
    );
  }

  const now = new Date();
  const currentWeather = data.timeseries.reduce((prev: any, curr: any) => {
    const prevDiff = Math.abs(new Date(prev.validTime).getTime() - now.getTime());
    const currDiff = Math.abs(new Date(curr.validTime).getTime() - now.getTime());
    return currDiff < prevDiff ? curr : prev;
  });

  const weekly = adaptWeatherToWeek(data.timeseries);

  return (
    <div className="flex flex-col gap-8 w-full">
      <WeatherClient
        city={city}
        initialRawData={data.timeseries}
        initialWeekly={weekly}
        initialCurrentWeather={currentWeather}
      />
    </div>
  );
}
