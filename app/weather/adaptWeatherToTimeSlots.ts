import type { TimeSeries } from "@/types/weather-types";

export type TimeSlot = "00-06" | "06-12" | "12-18" | "18-24";

export type AdaptedTimeSlot = {
  slot: TimeSlot;
  minTemp: number;
  maxTemp: number;
  condition: string;
};

export function adaptWeatherToTimeSlots(
  timeseries: TimeSeries[],
): AdaptedTimeSlot[] {
  const todayIso = new Date().toISOString().slice(0, 10);

  const todaysEntries = timeseries.filter(
    (entry) => entry.validTime.slice(0, 10) === todayIso,
  );

  const slotMap: Record<TimeSlot, TimeSeries[]> = {
    "00-06": [],
    "06-12": [],
    "12-18": [],
    "18-24": [],
  };

  todaysEntries.forEach((entry) => {
    const hour = new Date(entry.validTime).getHours();

    if (hour < 6) slotMap["00-06"].push(entry);
    else if (hour < 12) slotMap["06-12"].push(entry);
    else if (hour < 18) slotMap["12-18"].push(entry);
    else slotMap["18-24"].push(entry);
  });

  return (Object.keys(slotMap) as TimeSlot[])
    .map((slot) => {
      const entries = slotMap[slot];
      if (entries.length === 0) return null;

      const temperatures = entries.map((e) => e.temp);
      const minTemp = Math.min(...temperatures);
      const maxTemp = Math.max(...temperatures);

      const conditionCount = new Map<string, number>();

      entries.forEach((e) => {
        const current = conditionCount.get(e.summary) ?? 0;
        conditionCount.set(e.summary, current + 1);
      });

      const sortedConditions = [...conditionCount.entries()].sort(
        (a, b) => b[1] - a[1],
      );

      const condition = sortedConditions[0]?.[0] ?? "Unknown";

      return {
        slot,
        minTemp: Math.round(minTemp),
        maxTemp: Math.round(maxTemp),
        condition,
      };
    })
    .filter(Boolean) as AdaptedTimeSlot[];
}
