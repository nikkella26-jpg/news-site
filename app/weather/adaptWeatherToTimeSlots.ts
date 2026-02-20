import type { TimeSeries } from "@/types/weather-types";

export type TimeSlot = "00-06" | "06-12" | "12-18" | "18-24";

export type AdaptedTimeSlot = {
  slot: TimeSlot;
  avgTemp: number | null;
  condition: string;
  isPast?: boolean;
};

export function adaptWeatherToTimeSlots(
  timeseries: TimeSeries[],
): AdaptedTimeSlot[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const currentHour = now.getHours();

  // Filter entries that match the LOCAL today's date
  const todaysEntries = timeseries.filter((entry) => {
    const entryDate = new Date(entry.validTime);
    return (
      entryDate.getFullYear() === year &&
      entryDate.getMonth() === month &&
      entryDate.getDate() === day
    );
  });

  const slotMap: Record<TimeSlot, TimeSeries[]> = {
    "00-06": [],
    "06-12": [],
    "12-18": [],
    "18-24": [],
  };

  todaysEntries.forEach((entry) => {
    const entryDate = new Date(entry.validTime);
    const hour = entryDate.getHours();

    if (hour < 6) slotMap["00-06"].push(entry);
    else if (hour < 12) slotMap["06-12"].push(entry);
    else if (hour < 18) slotMap["12-18"].push(entry);
    else slotMap["18-24"].push(entry);
  });

  const slotsOrder: TimeSlot[] = ["00-06", "06-12", "12-18", "18-24"];

  return slotsOrder.map((slot) => {
    const entries = slotMap[slot];

    // Determine if this slot is in the past
    // A slot is "past" if its end hour is less than or equal to current hour
    const slotEndHour = parseInt(slot.split("-")[1], 10);
    const isPast = slotEndHour <= currentHour;

    if (entries.length === 0) {
      return {
        slot,
        avgTemp: null,
        condition: isPast ? "Past" : "No data",
        isPast,
      };
    }

    const avgTemp =
      entries.reduce((sum, e) => sum + e.temp, 0) / entries.length;

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
      avgTemp: Math.round(avgTemp),
      condition,
      isPast,
    };
  });
}
