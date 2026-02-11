import { TimeSeries } from "@/types/weather-types";

export type TimeSlot = "00-06" | "07-12" | "13-18" | "19-24";

export function adaptWeatherToTimeSlots(
  timeseries: TimeSeries[],
): Record<TimeSlot, TimeSeries[]> {
  const today = new Date();

  const todaysEntries = timeseries.filter((entry) => {
    const entryDate = new Date(entry.validTime);

    return (
      entryDate.getFullYear() === today.getFullYear() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getDate() === today.getDate()
    );
  });

  const slots: Record<TimeSlot, TimeSeries[]> = {
    "00-06": [],
    "07-12": [],
    "13-18": [],
    "19-24": [],
  };

  todaysEntries.forEach((entry) => {
    const hour = new Date(entry.validTime).getHours();

    if (hour < 7) slots["00-06"].push(entry);
    else if (hour < 13) slots["07-12"].push(entry);
    else if (hour < 19) slots["13-18"].push(entry);
    else slots["19-24"].push(entry);
  });

  return slots;
}
