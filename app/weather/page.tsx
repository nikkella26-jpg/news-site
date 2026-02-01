async function getWeatherByLocation(location: string) {
  try {
    // fetch SMHI
    return {
      location,
      temperature: 7,
      summary: "Cloudy",
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function Page() {
  const weather = await getWeatherByLocation("Linköping");

  if (!weather) {
    return <div>Failed to load weather data.</div>;
  }

  return <pre>{JSON.stringify(weather, null, 2)}</pre>;
}
