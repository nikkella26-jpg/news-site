import { summarizeDay } from "./utils/summarizeDay";
import type { TimeSeries } from "@/types/weather-types";

export type AdaptedDailyWeather = {
  date: string;
  dayLabel: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
};

export function adaptWeatherToWeek(
  rawHours: TimeSeries[],
): AdaptedDailyWeather[] {
  const today = new Date().toDateString();
  const days = new Map<string, TimeSeries[]>();

  for (const hour of rawHours) {
    const date = new Date(hour.validTime);
    const dayKey = date.toDateString();

    if (dayKey === today) continue;

    if (!days.has(dayKey)) {
      days.set(dayKey, []);
    }

    days.get(dayKey)!.push(hour);
  }

  return Array.from(days.entries())
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(0, 6)
    .map(([, hours]) => {
      const dateObj = new Date(hours[0].validTime);

      const summary = summarizeDay(
        hours.map((h) => ({
          temp: h.temp,
          summary: h.summary,
        })),
      );

      return {
        date: dateObj.toLocaleDateString("sv-SE"),
        dayLabel: dateObj.toLocaleDateString("en-GB", {
          weekday: "short",
        }),
        ...summary,
      };
    });
}
