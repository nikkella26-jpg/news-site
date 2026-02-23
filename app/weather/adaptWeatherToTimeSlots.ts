import type { TimeSeries } from "@/types/weather-types";

export type TimeSlot = "00-06" | "06-12" | "12-18" | "18-24";

export type AdaptedTimeSlot = {
  slot: TimeSlot;
  avgTemp: number | null;
  minTemp: number | null;
  maxTemp: number | null;
  condition: string;
  isPast?: boolean;
};

export function adaptWeatherToTimeSlots(
  timeseries: TimeSeries[],
  targetDate?: Date
): AdaptedTimeSlot[] {
  const now = new Date();
  const target = targetDate || now;
  const year = target.getFullYear();
  const month = target.getMonth();
  const day = target.getDate();

  const isTargetToday = target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate();
  const isTargetPast = !isTargetToday && target < now;

  const currentHour = now.getHours();

  // Filter entries that match the LOCAL target date
  const filteredEntries = timeseries.filter((entry) => {
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

  filteredEntries.forEach((entry) => {
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
    const slotEndHour = parseInt(slot.split("-")[1], 10);
    const isPast = isTargetPast || (isTargetToday && slotEndHour <= currentHour);

    if (entries.length === 0) {
      return {
        slot,
        avgTemp: null,
        minTemp: null,
        maxTemp: null,
        condition: isPast ? "Past" : "No data",
        isPast,
      };
    }

    const temps = entries.map(e => e.temp);
    const avgTemp = temps.reduce((sum, t) => sum + t, 0) / temps.length;
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

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
      minTemp: Math.round(minTemp),
      maxTemp: Math.round(maxTemp),
      condition,
      isPast,
    };
  });
}
