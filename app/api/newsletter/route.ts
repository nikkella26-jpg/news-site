import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      newsletterSubscribed: !user?.newsletterSubscribed,
    },
  });

  return NextResponse.json({
    newsletterSubscribed: updated.newsletterSubscribed,
  });
}
