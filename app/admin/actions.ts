"use server";

import prisma from "@/lib/prisma";

export async function getAdminStats() {
  const [totalUsers, activeSubscriptions, totalArticles] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({
      where: {
        status: "active",
      },
    }),
    prisma.article.count(),
  ]);

  return {
    totalUsers,
    activeSubscriptions,
    totalArticles,
  };
}
