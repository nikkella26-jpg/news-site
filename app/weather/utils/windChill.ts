export function calculateFeelsLike(
  airTemp: number,
  windSpeed: number,
): { feelsLike: number; hasWindChill: boolean } {
  if (airTemp > 10 || windSpeed < 1.3) {
    return {
      feelsLike: Math.round(airTemp),
      hasWindChill: false,
    };
  }

  const feelsLike =
    13.12 +
    0.6215 * airTemp -
    11.37 * Math.pow(windSpeed, 0.16) +
    0.3965 * airTemp * Math.pow(windSpeed, 0.16);

  return {
    feelsLike: Math.round(feelsLike),
    hasWindChill: true,
  };
}
