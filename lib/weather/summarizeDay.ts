export function summarizeDay(entries: any[]) {
    return {
        minTemp: Math.round(Math.min(...entries.map((e) => e.temp))),
        maxTemp: Math.round(Math.max(...entries.map((e) => e.temp))),
        maxWind: Math.round(Math.max(...entries.map((e) => e.windSpeed))),
        dominantCondition: entries[0].summary,
    };
}
