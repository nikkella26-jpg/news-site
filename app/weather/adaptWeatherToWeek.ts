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
  const todayIso = new Date().toISOString().slice(0, 10);

  const days = new Map<string, { timestamp: number; entries: TimeSeries[] }>();

  for (const hour of rawHours) {
    const date = new Date(hour.validTime);
    const isoDate = date.toISOString().slice(0, 10);

    if (isoDate === todayIso) continue;

    if (!days.has(isoDate)) {
      days.set(isoDate, {
        timestamp: date.getTime(),
        entries: [],
      });
    }

    days.get(isoDate)!.entries.push(hour);
  }

  return Array.from(days.entries())
    .sort(([, a], [, b]) => a.timestamp - b.timestamp)
    .slice(0, 7)
    .map(([isoDate, { entries }]) => {
      const dateObj = new Date(isoDate);

      const summary = summarizeDay(
        entries.map((h) => ({
          temp: h.temp,
          summary: h.summary,
        })),
      );

      return {
        date: isoDate,
        dayLabel: dateObj.toLocaleDateString("en-GB", {
          weekday: "short",
        }),
        ...summary,
      };
    });
}
