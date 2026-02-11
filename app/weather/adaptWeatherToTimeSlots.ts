import type { TimeSeries } from "@/types/weather-types";

export type TimeSlot = "00-06" | "07-12" | "13-18" | "19-24";

export type AdaptedTimeSlot = {
  time: TimeSlot;
  avgTemp: number;
  condition: string;
};

export function adaptWeatherToTimeSlots(
  timeseries: TimeSeries[],
): AdaptedTimeSlot[] {
  const today = new Date();

  const todaysEntries = timeseries.filter((entry) => {
    const entryDate = new Date(entry.validTime);

    return (
      entryDate.getFullYear() === today.getFullYear() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getDate() === today.getDate()
    );
  });

  const slotMap: Record<TimeSlot, TimeSeries[]> = {
    "00-06": [],
    "07-12": [],
    "13-18": [],
    "19-24": [],
  };

  todaysEntries.forEach((entry) => {
    const hour = new Date(entry.validTime).getHours();

    if (hour < 7) slotMap["00-06"].push(entry);
    else if (hour < 13) slotMap["07-12"].push(entry);
    else if (hour < 19) slotMap["13-18"].push(entry);
    else slotMap["19-24"].push(entry);
  });

  return (Object.keys(slotMap) as TimeSlot[])
    .map((time) => {
      const entries = slotMap[time];
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
        time,
        avgTemp: Math.round(avgTemp),
        condition,
      };
    })
    .filter(Boolean) as AdaptedTimeSlot[];
}
