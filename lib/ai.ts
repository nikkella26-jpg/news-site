import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export async function generateArticleContent(title: string) {
  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("AI Error: No API key found in environment variables.");
    throw new Error("API key missing");
  }

  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: `Act as a senior journalist for a leading global news outlet.
      Write a comprehensive, professional, and engaging news article with the title: "${title}".
      
      Requirements:
      - Include a strong lead, context, and multiple detailed body paragraphs.
      - Use an authoritative, analytical, and sophisticated tone.
      - Format as plain text with double line breaks between paragraphs.
      - Aim for 600-800 words of high-quality content.
      - DO NOT use markdown headers or special formatting symbols.`,
    });

    return text;
  } catch (error: any) {
    // Graceful error handling for Quota/API limits
    const isQuotaError = error?.status === 429 || error?.message?.includes("quota") || error?.message?.includes("429");

    if (isQuotaError) {
      console.warn(`[AI Quota Hint]: Daily limit reached for "${title}". Content fulfillment paused.`);
    } else {
      console.error(`[AI Error]: Failed to generate content for "${title}".`);
    }

    throw error;
  }
}
