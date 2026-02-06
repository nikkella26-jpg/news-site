import { calculateFeelsLike } from "./windChill";

export function buildWeatherPerception(
  airTemp: number,
  _windSpeed: number,
): number {
  return calculateFeelsLike(airTemp, _windSpeed).feelsLike;
}
