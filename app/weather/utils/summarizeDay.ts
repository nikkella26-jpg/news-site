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

  const conditionCount = new Map<string, number>();

  entries.forEach((e) => {
    const current = conditionCount.get(e.summary) ?? 0;
    conditionCount.set(e.summary, current + 1);
  });

  const condition = [...conditionCount.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  return {
    minTemp: Math.round(minTemp),
    maxTemp: Math.round(maxTemp),
    condition,
  };
}
