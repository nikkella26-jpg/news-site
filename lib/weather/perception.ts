// src/lib/weather/perception.ts

import { calculateFeelsLike } from "./windChill";

export function buildWeatherPerception(
    airTemp: number,
    windSpeed: number
) {
    const { feelsLike, hasWindChill } =
        calculateFeelsLike(airTemp, windSpeed);

    const delta = feelsLike - airTemp;

    return {
        airTemp: Math.round(airTemp),
        feelsLike,
        windSpeed,
        delta,
        renderFeelsLike: hasWindChill && delta <= -3,
    };
}
