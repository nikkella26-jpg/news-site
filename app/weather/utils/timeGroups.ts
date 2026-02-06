export type TimeGroupKey = "night" | "morning" | "afternoon" | "evening";

export function getTimeGroup(date: Date): TimeGroupKey {
  const hour = date.getHours();

  if (hour >= 0 && hour <= 6) return "night";
  if (hour >= 7 && hour <= 12) return "morning";
  if (hour >= 13 && hour <= 18) return "afternoon";
  return "evening";
}
