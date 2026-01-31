export async function getWeatherByLocation(location: string) {
  try {
    // call SMHI / action / fetch here
    // normalize the result

    return {
      location,
      temperature: 7,
      summary: "Cloudy",
    };
  } catch (error) {
    console.error("Weather service failed:", error);
    return null;
  }
}
