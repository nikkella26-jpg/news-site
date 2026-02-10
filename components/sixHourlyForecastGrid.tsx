"use client";

interface sixHourlyForecastGrid {
  label: string;
  avgTemp: number;
}
type TimeSlot = {
  time: string;
  temp: number;
  condition?: string;
};
type sixHourlyForecastGridProps = {
  forecasts: TimeSlot[];
};

function sixHourlyForecastGrid({ forecasts }: sixHourlyForecastGridProps) {
  return (
    <div className="six-hourly-grid, h5">
      {forecasts.map((forecast) => (
        <div key={forecast.time} className="border-spacing-x-1hourly-row">
          <strong>{forecast.time}</strong>
          <span>{forecast.temp}°</span>
          <span>…</span>
        </div>
      ))}
    </div>
  );
}

export default sixHourlyForecastGrid;
