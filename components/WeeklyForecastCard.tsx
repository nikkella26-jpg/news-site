import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun
} from "lucide-react";

type Props = {
  dayLabel: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
};

const getWeatherIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes("clear") || c.includes("sun")) return <Sun className="w-6 h-6 text-amber-500" />;
  if (c.includes("partly") || c.includes("mainly")) return <CloudSun className="w-6 h-6 text-sky-500" />;
  if (c.includes("cloud")) return <Cloud className="w-6 h-6 text-slate-400" />;
  if (c.includes("fog")) return <CloudFog className="w-6 h-6 text-slate-300" />;
  if (c.includes("drizzle")) return <CloudDrizzle className="w-6 h-6 text-blue-300" />;
  if (c.includes("rain")) return <CloudRain className="w-6 h-6 text-blue-500" />;
  if (c.includes("snow")) return <CloudSnow className="w-6 h-6 text-blue-100" />;
  if (c.includes("thunder")) return <CloudLightning className="w-6 h-6 text-purple-500" />;
  return <Cloud className="w-6 h-6 text-slate-400" />;
};

export function WeeklyForecastCard({
  dayLabel,
  minTemp,
  maxTemp,
  condition,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        bg-card/40 dark:bg-card/20
        backdrop-blur-md
        border border-border
        shadow-2xl shadow-black/5
        p-4
        text-center
        flex flex-col items-center
        transition-all duration-300
        hover:bg-card/60 dark:hover:bg-card/40 hover:-translate-y-1
      "
    >
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">{dayLabel}</p>

      <div className="mb-3">
        {getWeatherIcon(condition)}
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-lg font-black text-foreground leading-none">
          {maxTemp}°
        </p>
        <p className="text-xs font-bold text-muted-foreground leading-none">
          {minTemp}°
        </p>
      </div>

      <p className="mt-3 text-[10px] font-black text-muted-foreground uppercase tracking-tight truncate w-full">
        {condition}
      </p>
    </div>
  );
}
