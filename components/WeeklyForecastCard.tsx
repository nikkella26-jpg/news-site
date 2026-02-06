type Props = {
    dayLabel: string;
    minTemp: number;
    maxTemp: number;
    condition: string;
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
        rounded-2xl
        bg-white/55
        backdrop-blur-sm
        border border-white/40
        shadow-sm shadow-slate-900/5
        p-4
        text-center
      "
        >
            <p className="text-sm font-medium text-slate-700">
                {dayLabel}
            </p>

            <p className="mt-2 text-xl font-semibold text-slate-800">
                {minTemp}° / {maxTemp}°
            </p>

            <p className="mt-1 text-xs text-slate-600">
                {condition}
            </p>
        </div>
    );
}
