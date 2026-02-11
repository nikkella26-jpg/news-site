import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCategories } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArticleForm from "./ArticleForm";

export default async function NewArticlePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session?.user.role?.toLowerCase();
  if (!session || (role !== "admin" && role !== "editor")) {
    redirect("/");
  }

  const categories = await getCategories();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/articles"
        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to list
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Article</h1>
      </div>

      <ArticleForm categories={categories} />
    </div>
  );
}