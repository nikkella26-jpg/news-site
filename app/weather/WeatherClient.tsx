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
  CalendarDays,
  ArrowUp,
  ArrowDown,
  AlertTriangle
} from "lucide-react";
import { WeeklyForecastCard } from "@/components/WeeklyForecastCard";
import { adaptWeatherToTimeSlots } from "./adaptWeatherToTimeSlots";
import { adaptWeatherToWeek } from "./adaptWeatherToWeek";
import { cn } from "@/lib/utils";
import { fetchWeatherByLocation } from "@/lib/weather";
import type { TimeSeries } from "@/types/weather-types";
import { simulateSnowStormAlert } from "@/actions/alert-simulation";

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
  const [rawData, setRawData] = useState<TimeSeries[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekly, setWeekly] = useState<ReturnType<typeof adaptWeatherToWeek>>([]);
  const [currentWeather, setCurrentWeather] = useState<TimeSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationResolved, setLocationResolved] = useState(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const formatTemp = (temp: number | null) => {
    if (temp === null) return null;
    if (unit === 'C') return Math.round(temp);
    return Math.round((temp * 9 / 5) + 32);
  };

  const toggleUnit = () => setUnit(prev => prev === 'C' ? 'F' : 'C');

  // Derived time slots based on selected date
  const timeSlots = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    return adaptWeatherToTimeSlots(rawData, selectedDate);
  }, [rawData, selectedDate]);

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

  // Fetch weather
  useEffect(() => {
    if (!locationResolved) return;

    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      try {
        const cacheKey = `weather_full_${city}`;
        const { clientCache } = await import("@/lib/cache");
        const cachedData = clientCache.get(cacheKey);

        if (cachedData && Array.isArray(cachedData.rawData)) {
          setRawData(cachedData.rawData);
          setWeekly(adaptWeatherToWeek(cachedData.rawData));
          setCurrentWeather(cachedData.currentWeather);
          setLoading(false);
          return;
        }

        const data = await fetchWeatherByLocation(city, { signal: controller.signal });

        if (!Array.isArray(data.timeseries)) {
          throw new Error("Unexpected weather data format");
        }

        const now = new Date();
        const currentWeather = data.timeseries.reduce((prev, curr) => {
          const prevDiff = Math.abs(new Date(prev.validTime).getTime() - now.getTime());
          const currDiff = Math.abs(new Date(curr.validTime).getTime() - now.getTime());
          return currDiff < prevDiff ? curr : prev;
        });

        const newWeekly = adaptWeatherToWeek(data.timeseries);

        setRawData(data.timeseries);
        setWeekly(newWeekly);
        setCurrentWeather(currentWeather);

        clientCache.set(cacheKey, {
          rawData: data.timeseries,
          weekly: newWeekly,
          currentWeather
        }, 3);

        // --- AUTOMATIC HAZARD DETECTION ---
        // If current weather indicates a extremely dangerous storm or blizzard
        const hazardCondition = currentWeather.summary.toLowerCase();
        const isHazardous =
          hazardCondition.includes("storm") ||
          hazardCondition.includes("blizzard") ||
          hazardCondition.includes("heavy snow");

        if (isHazardous) {
          console.log("[HAZARD DETECTED] Automatically activating site-wide emergency alert.");
          await simulateSnowStormAlert();
        }
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Left: Location */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-500 font-medium mb-1">
              <MapPin className="w-4 h-4" />
              <span className="tracking-wide uppercase text-xs font-bold">Current Location</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              {city}
            </h1>
          </div>

          {/* Center: Unit Toggle */}
          <div className="flex items-center justify-center">
            <button
              onClick={toggleUnit}
              className="group relative flex items-center gap-1 bg-muted/30 hover:bg-muted/50 border border-border/50 p-1.5 rounded-2xl transition-all duration-300"
            >
              <div className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                unit === 'C' ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30" : "text-muted-foreground"
              )}>°C</div>
              <div className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                unit === 'F' ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30" : "text-muted-foreground"
              )}>°F</div>
            </button>
          </div>

          {/* Right: Date */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="text-muted-foreground font-bold flex items-center gap-2 bg-muted/50 px-5 py-2.5 rounded-2xl border border-border/50 whitespace-nowrap shadow-sm">
              <CalendarDays className="w-5 h-5 text-cyan-500/70" />
              {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Highlight Card */}
        {currentWeather && (
          <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-8 md:p-12 text-white shadow-2xl shadow-indigo-200 group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-200 mb-4 bg-white/10 w-fit px-4 py-1 rounded-full mx-auto md:mx-0">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Live Forecast: Now</span>
                </div>
                <p className="text-indigo-100 font-medium mb-2">Expect {currentWeather.summary.toLowerCase()} right now</p>
                <div className="text-7xl md:text-8xl font-black">{formatTemp(currentWeather.temp)}°</div>
                <p className="text-xl md:text-2xl text-indigo-100 font-medium mt-2">{currentWeather.summary}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-6 md:gap-12 p-6 rounded-3xl bg-black/10 backdrop-blur-md border border-white/10">
                <div className="flex flex-col items-center">
                  <Thermometer className="w-6 h-6 text-indigo-200 mb-2" />
                  <span className="text-sm text-indigo-100">Temp</span>
                  <span className="font-bold">{formatTemp(currentWeather.temp)}°{unit}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Droplets className="w-6 h-6 text-indigo-200 mb-2" />
                  <span className="text-sm text-indigo-100">Humidity</span>
                  <span className="font-bold">{currentWeather.humidity}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <Wind className="w-6 h-6 text-indigo-200 mb-2" />
                  <span className="text-sm text-indigo-100">Wind</span>
                  <span className="font-bold">{Math.round(currentWeather.windSpeed)}km/h</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Timeline Section */}
      <section className="mb-12">
        <h2 className="text-xl font-black text-foreground mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedDate.toLocaleDateString() === new Date().toLocaleDateString()
              ? "Today's Forecast"
              : `${selectedDate.toLocaleDateString("en-US", { weekday: 'long' })}'s Forecast`}
          </div>
          {selectedDate.toLocaleDateString() !== new Date().toLocaleDateString() && (
            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-xs bg-muted hover:bg-border px-3 py-1 rounded-full transition-colors"
            >
              Reset to Today
            </button>
          )}
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
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <ArrowUp className="w-3.5 h-3.5 text-rose-500/70" />
                    <span className="text-2xl font-black text-foreground">
                      {slot.maxTemp !== null ? `${formatTemp(slot.maxTemp)}°` : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 contrast-75">
                    <ArrowDown className="w-3.5 h-3.5 text-sky-500/70" />
                    <span className="text-lg font-bold text-muted-foreground/60">
                      {slot.minTemp !== null ? `${formatTemp(slot.minTemp)}°` : ""}
                    </span>
                  </div>
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
                minTemp={formatTemp(day.minTemp) as number}
                maxTemp={formatTemp(day.maxTemp) as number}
                condition={day.condition}
                isActive={selectedDate.toISOString().slice(0, 10) === day.date}
                onClick={() => setSelectedDate(new Date(day.date))}
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
