export type TimeSlot = "00-06" | "06-12" | "12-18" | "18-24";

export type AdaptedTimeSlotWeather = {
  time?: string;
  airTemp?: number;
  windSpeed?: number;
  condition: string;
  humidity?: number;
  slot?: TimeSlot;
  label?: string;
  minTemp?: number;
  maxTemp?: number;
  icon?: "sun" | "moon" | "cloud-sun" | "cloud-moon" | "cloud";
};

type WeatherEntry = {
  time: string;
  data: {
    instant: {
      details: {
        air_temperature?: number;
        temperature?: number;
        wind_speed?: number;
        relative_humidity?: number;
      };
    };
    next_1_hours?: {
      summary: {
        symbol_code: string;
      };
    };
    next_6_hours?: {
      summary: {
        symbol_code: string;
      };
    };
  };
};

export function adaptWeatherToTimeSlots(timeseries: Array<WeatherEntry>) {
  return timeseries.map((entry: WeatherEntry) => ({
    time: entry.time,
    airTemp:
      entry.data?.instant?.details?.air_temperature ??
      entry.data?.instant?.details?.temperature ??
      0,
    windSpeed: entry.data?.instant?.details?.wind_speed ?? 0,
    condition:
      entry.data?.next_1_hours?.summary?.symbol_code ??
      entry.data?.next_6_hours?.summary?.symbol_code ??
      "Unknown",
    humidity: entry.data?.instant?.details?.relative_humidity ?? 0,
  }));
}

export function mapSymbolToIcon(
  dominantSymbol: number,
  isDaylight: boolean,
): "sun" | "moon" | "cloud-sun" | "cloud-moon" | "cloud" {
  const isClear = dominantSymbol <= 2;
  const hasRain = dominantSymbol >= 51;

  if (isClear) {
    return isDaylight ? "sun" : "moon";
  } else if (hasRain || dominantSymbol === 3) {
    return isDaylight ? "cloud-sun" : "cloud-moon";
  }

  return "cloud";
}
