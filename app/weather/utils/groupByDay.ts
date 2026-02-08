interface TimeSeriesEntry {
  validTime: string;
  [key: string]: unknown;
}

export default function groupByDay(
  timeseries: TimeSeriesEntry[],
): Record<string, TimeSeriesEntry[]> {
  const days: Record<string, TimeSeriesEntry[]> = {};

  timeseries.forEach((entry) => {
    const dayKey = entry.validTime.slice(0, 10); // YYYY-MM-DD
    if (!days[dayKey]) days[dayKey] = [];
    days[dayKey].push(entry);
  });

  return days;
}
