import WeatherClient from "./WeatherClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city = "Linköping" } = await searchParams;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-teal-100 via-cyan-50 to-stone-100" />
      <WeatherClient city={city} />
    </div>
  );
}
