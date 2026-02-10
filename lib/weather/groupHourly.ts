import type { WeatherType } from "@/types/weather-types";

export function groupHourlyTimeseries(timeseries: WeatherType["timeseries"]) {
  const groups = {
    night: [],
    morning: [],
    afternoon: [],
    evening: [],
  } as Record<string, WeatherType["timeseries"]>;

  timeseries.forEach((entry) => {
    const hour = entry.validTime.split("T")[1].slice(0, 2);

    if (["20", "21", "22", "23", "00", "01", "02", "03", "04"].includes(hour)) {
      groups.night.push(entry);
    }
    if (["05", "06", "07", "08", "09"].includes(hour)) {
      groups.morning.push(entry);
    }
    if (["10", "11", "12", "13", "14", "15"].includes(hour)) {
      groups.afternoon.push(entry);
    }
    if (["16", "17", "18", "19"].includes(hour)) {
      groups.evening.push(entry);
    }
  });

  return groups;
}
