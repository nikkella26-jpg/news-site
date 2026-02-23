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
  const now = new Date();
  // Create a YYYY-MM-DD string for "today" in LOCAL time
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const days = new Map<string, { timestamp: number; entries: TimeSeries[] }>();

  for (const hour of rawHours) {
    const entryDate = new Date(hour.validTime);
    // Create a YYYY-MM-DD string for the entry in LOCAL time
    const entryDateStr = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}-${String(entryDate.getDate()).padStart(2, '0')}`;

    // Skip today and any past dates in the weekly forecast
    if (entryDateStr <= todayStr) {
      continue;
    }

    // Use the LOCAL string as the unique key for the day bucket
    if (!days.has(entryDateStr)) {
      days.set(entryDateStr, {
        timestamp: entryDate.getTime(),
        entries: [],
      });
    }

    days.get(entryDateStr)!.entries.push(hour);
  }

  return Array.from(days.entries())
    .sort(([, a], [, b]) => a.timestamp - b.timestamp)
    .slice(0, 7)
    .map(([dateString, { entries }]) => {
      // Parse YYYY-MM-DD manually to create a reliable local Date object
      const [y, m, d] = dateString.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);

      const summary = summarizeDay(
        entries.map((h) => ({
          temp: h.temp,
          summary: h.summary,
        })),
      );

      return {
        date: dateString,
        dayLabel: dateObj.toLocaleDateString("en-GB", {
          weekday: "short",
        }),
        ...summary,
      };
    });
}
