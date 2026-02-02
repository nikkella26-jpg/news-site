import WeatherClient from "./WeatherClient";

export default function Page({
  searchParams,
}: {
  searchParams?: { city?: string };
}) {
  const city = searchParams?.city ?? "Linköping";

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="fixed inset-0 -z-20 bg-linear-to-b from-teal-100 via-cyan-50 to-stone-100" />
      <WeatherClient city={city} />
    </div>
  );
}
