import WeatherClient from "./WeatherClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city = "Linköping" } = await searchParams;

  return (
    <div className="flex flex-col gap-8 w-full">
      <WeatherClient city={city} />
    </div>
  );
}
