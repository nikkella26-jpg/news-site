export function summarizeDay(entries: { temp: number; summary: string }[]) {
  if (entries.length === 0) {
    return {
      minTemp: 0,
      maxTemp: 0,
      condition: "Unknown",
    };
  }

  const minTemp = Math.min(...entries.map((e) => e.temp));
  const maxTemp = Math.max(...entries.map((e) => e.temp));

  const conditionCount: Record<string, number> = {};

  entries.forEach((e) => {
    conditionCount[e.summary] = (conditionCount[e.summary] || 0) + 1;
  });

  const condition = Object.entries(conditionCount).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  return {
    minTemp: Math.round(minTemp),
    maxTemp: Math.round(maxTemp),
    condition,
  };
}
