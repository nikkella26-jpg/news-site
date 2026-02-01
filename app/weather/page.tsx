async function getWeather() {
  await new Promise((r) => setTimeout(r, 1000));

  return {
    city: "Linköping",
    temperature: 7,
    summary: "Cloudy",
  };
}

export default async function Page() {
  const weather = await getWeather();

  return (
    <div>
      <h1>{weather.city}</h1>
      <p>{weather.summary}</p>
      <p>{weather.temperature}°C</p>
    </div>
  );
}
