import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return new Response("Missing slug", { status: 400 });
    }

    const updated = await prisma.article.update({
      where: { slug },
      data: {
        views: { increment: 1 },
      },
    });

    return Response.json({ views: updated.views });
  } catch (err) {
    console.error(err);
    return new Response("Error incrementing view", { status: 500 });
  }
}