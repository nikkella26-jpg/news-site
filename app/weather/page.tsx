import WeatherClient from "./WeatherClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city = "Linköping" } = await searchParams;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div
        className="
        fixed inset-0 -z-20
        bg-linear-to-b
        from-slate-200
        via-cyan-100
       to-stone-100
        "
      />
      <WeatherClient city={city} />
    </div>
  );
}
