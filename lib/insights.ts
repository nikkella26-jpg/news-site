interface WeatherInsights {
  flags: {
    isSnowing: boolean;
    isRaining: boolean;
    isStormy: boolean;
    isExtreme: boolean;
  };
  weeklyOutlook: string;
}

export function deriveInsights(weather: Weather): WeatherInsights {
  const current = weather.timeseries[0];
  const summary = current.summary?.toLowerCase() ?? "";

  const flags = {
    isSnowing: summary.includes("snow") || summary.includes("sleet"),
    isRaining: summary.includes("rain") || summary.includes("drizzle"),
    isStormy: summary.includes("storm") || summary.includes("thunder"),
    isExtreme:
      current.windSpeed > 15 || current.temp < -10 || current.temp > 35,
  };

  // Generate weekly outlook based on current conditions
  let outlook = "";

  if (flags.isExtreme) {
    outlook =
      "Extreme conditions detected. Exercise caution and avoid unnecessary outdoor activities.";
  } else if (flags.isStormy) {
    outlook =
      "Stormy weather ahead. Plan indoor activities and secure outdoor items.";
  } else if (flags.isSnowing) {
    outlook =
      "Snow expected. Prepare for winter conditions and allow extra travel time.";
  } else if (flags.isRaining) {
    outlook = "Rainy conditions. Bring an umbrella and expect wet roads.";
  } else if (current.temp > 25) {
    outlook =
      "Warm and pleasant conditions. Great time for outdoor activities.";
  } else if (current.temp < 5) {
    outlook = "Cold conditions. Dress warmly and watch for icy surfaces.";
  } else {
    outlook =
      "Moderate conditions expected. Suitable for most outdoor activities.";
  }

  return {
    flags,
    weeklyOutlook: outlook,
  };
}

export interface WeatherTimeseries {
  summary?: string;
  windSpeed: number;
  temp: number;
}

export interface Weather {
  timeseries: WeatherTimeseries[];
}
