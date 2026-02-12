export default function NotFound() {
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
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-800 mb-4">
            Location Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The location you&apos;re looking for could not be found. Please
            check the city name and try again.
          </p>
          <a
            href="/weather"
            className="inline-block px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Return to Weather
          </a>
        </div>
      </div>
    </div>
  );
}
