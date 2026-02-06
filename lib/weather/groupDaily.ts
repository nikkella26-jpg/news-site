import type { WeatherType } from "@/types/weather-types";

export function groupByDay(timeseries: WeatherType["timeseries"]) {
    const days: Record<string, WeatherType["timeseries"]> = {};

    timeseries.forEach((entry) => {
        const dayKey = entry.validTime.slice(0, 10); // YYYY-MM-DD
        if (!days[dayKey]) days[dayKey] = [];
        days[dayKey].push(entry);
    });

    return days;
}
