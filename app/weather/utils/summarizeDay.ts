interface WeatherEntry {
  temp: number;
  summary: string;
}

export function summarizeDay(entries: WeatherEntry[]) {
  return {
    minTemp: Math.round(Math.min(...entries.map((e) => e.temp))),
    maxTemp: Math.round(Math.max(...entries.map((e) => e.temp))),
    condition: entries[0].summary,
  };
}
