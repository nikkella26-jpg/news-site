export type AdaptedDailyWeather = {
  dayLabel: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
};

type RawHourlyWeather = {
  validTime: string; // ISO UTC
  temp: number;
  symbol: number;
  summary: string;
};

export function adaptWeatherToWeek(
  rawHours: RawHourlyWeather[],
): AdaptedDailyWeather[] {
  const today = new Date().toDateString();
  const days = new Map<string, RawHourlyWeather[]>();

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
    .slice(0, 6)
    .map(([dayKey, hours]) => summarizeDay(dayKey, hours));
}

function summarizeDay(
  dayKey: string,
  hours: RawHourlyWeather[],
): AdaptedDailyWeather {
  const temps = hours.map((h) => h.temp);

  const minTemp = Math.round(Math.min(...temps));
  const maxTemp = Math.round(Math.max(...temps));

  // Pick the most common summary (stable, human-friendly)
  const summaryCount = new Map<string, number>();
  for (const h of hours) {
    summaryCount.set(h.summary, (summaryCount.get(h.summary) ?? 0) + 1);
  }

  const condition = [...summaryCount.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  const date = new Date(hours[0].validTime);

  return {
    dayLabel: date.toLocaleDateString("en-GB", {
      weekday: "short",
    }),
    minTemp,
    maxTemp,
    condition,
  };
}
