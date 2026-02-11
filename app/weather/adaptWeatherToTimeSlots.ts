import type { TimeSeries } from "@/types/weather-types";

export type TimeSlot = "00-06" | "06-12" | "12-18" | "18-24";

export type AdaptedTimeSlot = {
  slot: TimeSlot;
  avgTemp: number;
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

      const avgTemp =
        entries.reduce((sum, e) => sum + e.temp, 0) / entries.length;

      const conditionCount: Record<string, number> = {};

      entries.forEach((e) => {
        conditionCount[e.summary] = (conditionCount[e.summary] || 0) + 1;
      });

      const condition = Object.entries(conditionCount).sort(
        (a, b) => b[1] - a[1],
      )[0][0];

      return {
        slot,
        avgTemp: Math.round(avgTemp),
        condition,
      };
    })
    .filter(Boolean) as AdaptedTimeSlot[];
}
