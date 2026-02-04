"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getArticles() {
  await checkAuth();
  return await prisma.article.findMany({
    include: {
      author: {
        select: { name: true },
      },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategories() {
  await checkAuth();
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createArticle(data: {
  title: string;
  content: string;
  categoryId?: string;
  published?: boolean;
  isEditorsChoice?: boolean;
  image?: string;
}) {
  const session = await checkAuth();
  
  const slug = data.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const article = await prisma.article.create({
    data: {
      title: data.title,
      slug: `${slug}-${Date.now()}`,
      content: data.content,
      published: data.published ?? false,
      isEditorsChoice: data.isEditorsChoice ?? false,
      image: data.image,
      authorId: session.user.id,
      categoryId: data.categoryId,
    },
  });

  revalidatePath("/admin/articles");
  return article;
}

export async function updateArticle(id: string, data: {
  title?: string;
  content?: string;
  categoryId?: string;
  published?: boolean;
  isEditorsChoice?: boolean;
  image?: string;
}) {
  await checkAuth();

  const article = await prisma.article.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/articles");
  return article;
}

export async function deleteArticle(id: string) {
  await checkAuth();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
}

export async function toggleEditorsChoice(id: string, currentStatus: boolean) {
  await checkAuth();
  await prisma.article.update({
    where: { id },
    data: { isEditorsChoice: !currentStatus },
  });
  revalidatePath("/admin/articles");
}

export async function createCategory(name: string) {
  await checkAuth();
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return await prisma.category.create({
    data: { name, slug },
  });
}
