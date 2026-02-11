"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Role } from "@/lib/generated/prisma";

export async function getAllUsers() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session?.user.role?.toLowerCase();
  if (!session || role !== "admin") {
    throw new Error("Unauthorized");
  }

  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateUserRole(userId: string, role: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUserRole = session?.user.role?.toLowerCase();
  if (!session || currentUserRole !== "admin") {
    throw new Error("Unauthorized");
  }

  // Ensure the role string matches the Enum values (ADMIN, EDITOR, USER)
  const targetRole = role.toUpperCase() as Role;

  // Update directly via Prisma to bypass better-auth plugin restrictions
  await prisma.user.update({
    where: { id: userId },
    data: { role: targetRole },
  });

  revalidatePath("/admin/users");
}
