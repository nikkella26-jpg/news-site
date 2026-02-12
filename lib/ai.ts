import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

/* ───────────────────────── ARTICLE GENERATION ───────────────────────── */

export async function generateArticleContent(title: string) {
  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("AI API key missing");
  }

  const google = createGoogleGenerativeAI({ apiKey });

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `Write a professional news article in English with the title: "${title}".
The article should include a clear lead paragraph and several body paragraphs.
Write in a journalistic style.
Do not use markdown headers. Only plain text with double line breaks between paragraphs.`,
  });

  return text;
}

/* ───────────────────────── WEATHER SUMMARY ───────────────────────── */

export async function generateWeeklyWeatherSummary(
  city: string,
  weeklyData: {
    dayLabel: string;
    minTemp: number;
    maxTemp: number;
    condition: string;
  }[],
) {
  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("AI API key missing");
  }

  const google = createGoogleGenerativeAI({ apiKey });

  const structuredData = weeklyData
    .map((d) => `${d.dayLabel}: ${d.minTemp}° to ${d.maxTemp}°, ${d.condition}`)
    .join("\n");

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
Write a concise weekly weather summary for ${city}.
Use neutral and informative language.
Limit to 3–4 sentences.
Do not exaggerate or invent information.
Base your summary strictly on this data:

${structuredData}
`,
  });

  return text;
}
