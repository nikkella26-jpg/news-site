import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function summarizeArticle(content: string) {
  const result = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Summarize this article:\n${content}`,
  });

  return result.text;
}