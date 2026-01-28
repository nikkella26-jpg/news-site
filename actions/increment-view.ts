// actions/increment-view.ts
"use server";

// CHANGE THIS:
// import { viewSchema } from "@/lib/validators";

// TO THIS:
import { viewSchema } from "@/lib/validator"; 

const views = new Map<string, number>();

export async function incrementView(id: string) {
  // Now the validator will work correctly
  const result = viewSchema.safeParse({ articleId: id });
  
  if (!result.success) {
    throw new Error("Invalid Article ID format");
  }

  const currentViews = views.get(id) || 0;
  views.set(id, currentViews + 1);
  return currentViews + 1;
}
