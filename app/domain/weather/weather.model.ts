export type TemperatureCelsius = number;

export type UtcTimestamp = string; // ISO 8601 format

export interface WeatherSnapshot {
  readonly timestamp: UtcTimestamp;
  readonly temperature: TemperatureCelsius;
  readonly windSpeedMs: number;
  readonly windDirectionDegrees: number;
  readonly precipitationMm: number;
}

export interface SmhiWeatherAdapter {
  getCurrentWeather(locationId: string): Promise<WeatherSnapshot>;
  getWeatherForecast(
    locationId: string,
    hoursAhead: number,
  ): Promise<WeatherSnapshot[]>;
}
