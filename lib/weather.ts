export interface WeatherTimeseries {
  summary?: string;
  windSpeed: number;
  temp: number;
}

export interface Weather {
  timeseries: WeatherTimeseries[];
}
