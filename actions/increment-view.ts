"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validator direkt här för enkelhet, eller behåll din import
const viewSchema = z.object({
  articleId: z.string().uuid(), // Eftersom din modell använder UUID
});

export async function incrementView(id: string) {
  // 1. Validera ID:t
  const result = viewSchema.safeParse({ articleId: id });
  
  if (!result.success) {
    console.error("Valideringsfel:", result.error.format());
    // Vi returnerar 0 eller nuvarande istället för att krascha hela sidan
    return 0; 
  }

  try {
    // 2. Uppdatera visningar direkt i PostgreSQL via Prisma
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        views: {
          increment: 1, // Prisma-kommando för att öka med 1 atomiskt
        },
      },
    });

    return updatedArticle.views;
  } catch (error) {
    console.error("Kunde inte uppdatera visningar:", error);
    return 0;
  }
}
