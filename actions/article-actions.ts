"use server";

import prisma from "@/lib/prisma";
import { generateArticleContent } from "@/lib/ai";
import { revalidatePath } from "next/cache";

/**
 * Ensures an article has high-quality, long-form content.
 * If the current content is too short (a stub from seeding), 
 * it triggers the AI to fulfill the content and saves it to the database.
 */
export async function ensureFullArticleContent(articleId: string, title: string, currentContent: string) {
    // Define what we consider a "stub" (e.g., less than 150 characters)
    const isStub = currentContent.length < 150;

    if (!isStub) {
        return currentContent;
    }

    try {
        console.log(`[AI Fulfillment] Generating full content for stub article: "${title}"`);
        const fullContent = await generateArticleContent(title);

        // Save to database permanently
        await prisma.article.update({
            where: { id: articleId },
            data: { content: fullContent }
        });

        // Clear cache so all users see the new content immediately
        revalidatePath(`/articles/${articleId}`);

        return fullContent;
    } catch (error: any) {
        // Fallback to original content silently if AI fails or quota is hit
        return currentContent;
    }
}
