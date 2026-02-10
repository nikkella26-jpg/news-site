export function summarizeHourlyGroup(entries: { summary: string, temp: number, windSpeed: number, humidity: number }[]) {
    const avg = (vals: number[]) =>
        Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);

    const conditionCount: Record<string, number> = {};

    entries.forEach((e) => {
        conditionCount[e.summary] = (conditionCount[e.summary] || 0) + 1;
    });

    return {
        airTemp: avg(entries.map((e) => e.temp)),
        windSpeed: avg(entries.map((e) => e.windSpeed)),
        humidity: avg(entries.map((e) => e.humidity)),
        condition: Object.entries(conditionCount).sort((a, b) => b[1] - a[1])[0][0],
    };
}
