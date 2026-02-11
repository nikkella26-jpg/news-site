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
      model: google("gemini-2.5-flash"),
      prompt: `Write a professional news article in English with the title: "${title}". 
      The article should include a clear lead paragraph and several body paragraphs. 
      Write in a journalistic style. Do not use markdown headers (like # or ##), only plain text with double line breaks between paragraphs.`,
    });

    return text;
  } catch (error) {
    console.error("Detailed AI SDK Error:", error);
    throw error;
  }
}
