
export function getColdSeverityClass(feelsLike: number): string {
    if (feelsLike >= -5) return "text-foreground";
    if (feelsLike >= -10) return "text-blue-500";
    if (feelsLike >= -20) return "text-blue-700";
    return "text-violet-800";
}
