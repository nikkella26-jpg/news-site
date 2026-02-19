"use client";

import { useEffect, useState } from "react";

import { WeeklyForecastCard } from "@/components/WeeklyForecastCard";

import { type AdaptedTimeSlot } from "./adaptWeatherToTimeSlots";
import { type AdaptedDailyWeather } from "./adaptWeatherToWeek";
import { generateWeeklyWeatherSummary } from "@/lib/ai";

const conditionIcon = (summary: string) => {
  const s = summary.toLowerCase();

  if (s.includes("rain")) return "🌧️";
  if (s.includes("cloud")) return "☁️";
  if (s.includes("snow")) return "❄️";
  if (s.includes("full moon")) return "🌕";
  if (s.includes("sun") || s.includes("clear")) return "☀️";

  return "🌤️";
};

type WeatherClientProps = {
  city: string;
  weekly: AdaptedDailyWeather[];
  timeSlots: AdaptedTimeSlot[];
};

export default function WeatherClient({
  city,
  weekly,
  timeSlots,
}: WeatherClientProps) {
  const [aiWeeklySummary, setAiWeeklySummary] = useState<string>("");
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);
  const [lastFetchedCity, setLastFetchedCity] = useState<string>("");

  // Create a memoized key for the weekly data to avoid re-renders on reference changes
  const weeklyDataKey = JSON.stringify(weekly);

  // Generate AI weekly summary with Debounce
  useEffect(() => {
    const controller = new AbortController();

    // Debounce: Wait 1000ms before calling the AI
    const debounceTimer = setTimeout(async () => {
      // Don't re-fetch if we already have a summary for this city or data is missing
      if (!weekly || weekly.length === 0 || city === lastFetchedCity) {
        return;
      }


          setAiWeeklySummary(result);
          setLastFetchedCity(city);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("AI summary generation failed:", err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingAiSummary(false);
        }
      }
    }, 1000);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [city, weeklyDataKey, lastFetchedCity]);


  if (timeSlots.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {/* Header */}
      <section className="pt-10 pb-6">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Weather in {city}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Today’s forecast</p>
      </section>


      {/* Today – 4 time slots */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {timeSlots.map((slot: AdaptedTimeSlot) => (
          <div
            key={slot.slot}
            className="rounded-2xl bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-slate-800 p-4 shadow-sm"
          >
            <div className="flex flex-col items-center text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{slot.slot}</p>
              <span className="text-3xl mb-2" title={slot.condition}>
                {conditionIcon(slot.condition)}
              </span>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {slot.minTemp}° / {slot.maxTemp}°
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 capitalize">{slot.condition}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Weekly forecast */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
          7-Day Forecast
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
          {weekly.map((day: AdaptedDailyWeather, index: number) => (
            <WeeklyForecastCard
              key={index}
              dayLabel={day.dayLabel}
              minTemp={day.minTemp}
              maxTemp={day.maxTemp}
              condition={day.condition}
            />
          ))}
        </div>
      </section>

      {/* AI-Generated Weekly Summary */}
      {loadingAiSummary ? (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 animate-pulse">
          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
            Generating AI weekly weather summary...
          </p>
        </div>
      ) : aiWeeklySummary ? (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl" title="AI-generated summary">
              🤖
            </span>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                AI Weekly Forecast Summary
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                {aiWeeklySummary}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
