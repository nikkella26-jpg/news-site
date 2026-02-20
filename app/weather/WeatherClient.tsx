"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  CalendarDays
} from "lucide-react";
import { WeeklyForecastCard } from "@/components/WeeklyForecastCard";
import { adaptWeatherToTimeSlots } from "./adaptWeatherToTimeSlots";
import { adaptWeatherToWeek } from "./adaptWeatherToWeek";
import { cn } from "@/lib/utils";
import { fetchWeatherByLocation } from "@/lib/weather";

type WeatherClientProps = {
  city: string;
};

const getWeatherIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes("clear") || c.includes("sun")) return <Sun className="w-8 h-8 text-amber-500" />;
  if (c.includes("partly") || c.includes("mainly")) return <CloudSun className="w-8 h-8 text-sky-500" />;
  if (c.includes("cloud")) return <Cloud className="w-8 h-8 text-slate-400" />;
  if (c.includes("fog")) return <CloudFog className="w-8 h-8 text-slate-300" />;
  if (c.includes("drizzle")) return <CloudDrizzle className="w-8 h-8 text-blue-300" />;
  if (c.includes("rain")) return <CloudRain className="w-8 h-8 text-blue-500" />;
  if (c.includes("snow")) return <CloudSnow className="w-8 h-8 text-blue-100" />;
  if (c.includes("thunder")) return <CloudLightning className="w-8 h-8 text-purple-500" />;
  return <Cloud className="w-8 h-8 text-slate-400" />;
};

const getSlotLabel = (slot: string) => {
  switch (slot) {
    case "00-06": return "Night";
    case "06-12": return "Morning";
    case "12-18": return "Afternoon";
    case "18-24": return "Evening";
    default: return slot;
  }
};

export default function WeatherClient({
  city: initialCity,
}: WeatherClientProps) {
  const [city, setCity] = useState(initialCity);
  const [timeSlots, setTimeSlots] = useState<ReturnType<typeof adaptWeatherToTimeSlots>>([]);
  const [weekly, setWeekly] = useState<ReturnType<typeof adaptWeatherToWeek>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationResolved, setLocationResolved] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setCity(initialCity);
  }, [initialCity]);

  // Resolve user's geolocation (if available)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationResolved(true);
      return;
    }

    const timeout = setTimeout(() => setLocationResolved(true), 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, we might reverse geocode here.
        // For this demo, we'll keep the city but mark as resolved.
        setLocationResolved(true);
        clearTimeout(timeout);
      },
      () => {
        setLocationResolved(true);
        clearTimeout(timeout);
      },
      { timeout: 5000 }
    );

    return () => clearTimeout(timeout);
  }, []);

  // Fetch weather only after location is resolved
  useEffect(() => {
    if (!locationResolved) return;

    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherByLocation(city, { signal: controller.signal });

        if (!Array.isArray(data.timeseries)) {
          throw new Error("Unexpected weather data format");
        }

        setTimeSlots(adaptWeatherToTimeSlots(data.timeseries));
        setWeekly(adaptWeatherToWeek(data.timeseries));
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();
    return () => controller.abort();
  }, [city, locationResolved]);

  /* ───────────────────────── UI STATES ───────────────────────── */

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-x-0 -bottom-8 text-center text-sm font-medium text-slate-500 animate-pulse">
            Fetching sky data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-card/50 backdrop-blur-md border border-destructive/20 text-center shadow-2xl shadow-destructive/10">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Oops!</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition shadow-lg shadow-primary/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (timeSlots.length === 0 && weekly.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        No weather data available for this location.
      </div>
    );
  }

  /* ───────────────────────── RENDER ───────────────────────── */

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24 animate-in fade-in duration-700">
      {/* Header & Current Status Card */}
      <section className="pt-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-500 font-medium mb-1">
              <MapPin className="w-4 h-4" />
              <span className="tracking-wide uppercase text-xs font-bold">Current Location</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              {city}
            </h1>
          </div>
          <div className="text-muted-foreground font-bold flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-2xl border border-border/50">
            <CalendarDays className="w-5 h-5" />
            {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Highlight Card */}
        {(() => {
          const currentHour = new Date().getHours();
          // Find the most relevant current or future slot
          let currentSlotIndex = -1;
          if (currentHour >= 18) currentSlotIndex = timeSlots.findIndex(s => s.slot === "18-24" && s.avgTemp !== null);
          else if (currentHour >= 12) currentSlotIndex = timeSlots.findIndex(s => s.slot === "12-18" && s.avgTemp !== null);
          else if (currentHour >= 6) currentSlotIndex = timeSlots.findIndex(s => s.slot === "06-12" && s.avgTemp !== null);
          else currentSlotIndex = timeSlots.findIndex(s => s.slot === "00-06" && s.avgTemp !== null);

          // Fallback to first available non-null slot if current is missing
          const highlightSlot = currentSlotIndex !== -1
            ? timeSlots[currentSlotIndex]
            : timeSlots.find(s => s.avgTemp !== null) || timeSlots[0];

          if (!highlightSlot) return null;

          return (
            <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-8 md:p-12 text-white shadow-2xl shadow-indigo-200 group">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-200 mb-4 bg-white/10 w-fit px-4 py-1 rounded-full mx-auto md:mx-0">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">Live Forecast: {getSlotLabel(highlightSlot.slot)}</span>
                  </div>
                  <p className="text-indigo-100 font-medium mb-2">Expect {highlightSlot.condition.toLowerCase()} right now</p>
                  <div className="text-7xl md:text-8xl font-black">{highlightSlot.avgTemp}°</div>
                  <p className="text-xl md:text-2xl text-indigo-100 font-medium mt-2">{highlightSlot.condition}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-12 p-6 rounded-3xl bg-black/10 backdrop-blur-md border border-white/10">
                  <div className="flex flex-col items-center">
                    <Thermometer className="w-6 h-6 text-indigo-200 mb-2" />
                    <span className="text-sm text-indigo-100">Temp</span>
                    <span className="font-bold">{highlightSlot.avgTemp}°C</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Droplets className="w-6 h-6 text-indigo-200 mb-2" />
                    <span className="text-sm text-indigo-100">Humidity</span>
                    <span className="font-bold">64%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Wind className="w-6 h-6 text-indigo-200 mb-2" />
                    <span className="text-sm text-indigo-100">Wind</span>
                    <span className="font-bold">12km/h</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Today's Timeline */}
      <section className="mb-12">
        <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
          Today's Forecast
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {timeSlots.map((slot) => (
            <div
              key={slot.slot}
              className={cn(
                "group relative overflow-hidden rounded-3xl bg-card/40 dark:bg-card/20 backdrop-blur-md border border-border shadow-2xl shadow-black/5 p-6 transition-all duration-300 hover:shadow-cyan-500/10 hover:-translate-y-1 hover:bg-card/60 dark:hover:bg-card/40",
                slot.isPast && "opacity-40 grayscale-[0.5]"
              )}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-cyan-50 transition-colors" />
              <div className="relative z-10">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">{getSlotLabel(slot.slot)}</p>
                <div className="mb-4">{getWeatherIcon(slot.condition)}</div>
                <div className="text-3xl font-black text-foreground mb-1">
                  {slot.avgTemp !== null ? `${slot.avgTemp}°` : "—"}
                </div>
                <p className="text-sm text-muted-foreground font-bold truncate">{slot.condition}</p>
              </div>
              {/* Timing hint */}
              <div className="mt-4 pt-4 border-t border-border/50 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                {slot.slot.split('-').join(':00 — ') + ':00'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly forecast */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-foreground">Next 7 Days</h2>
          <div className="h-px flex-1 bg-border/50 mx-6 hidden md:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekly.map((day, index) => (
            <div key={index} className="contents group">
              <WeeklyForecastCard
                dayLabel={day.dayLabel}
                minTemp={day.minTemp}
                maxTemp={day.maxTemp}
                condition={day.condition}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-widest gap-4">
        <p>© 2026 WeatherInsights • Data updated every hour</p>
        <div className="flex gap-6">
          <button className="hover:text-foreground transition">Temperature Unit: °C</button>
          <button className="hover:text-foreground transition">Privacy Policy</button>
        </div>
      </div>
    </div>
  );
}
