import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  getArticles,
  getCategories,
  deleteArticle,
  toggleEditorsChoice,
  createCategory,
} from "./actions";
import { Button } from "@/components/ui/button";

import type { Article, Category } from "@/lib/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star, Plus, FolderPlus } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Input } from "@/components/ui/input";

export default async function ArticlesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session?.user.role?.toLowerCase();
  if (!session || (role !== "admin" && role !== "editor")) {
    redirect("/");
  }

  const [articles, categories]: [Article[], Category[]] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);

  async function handleToggleEditorsChoice(id: string, current: boolean) {
    "use server";
    await toggleEditorsChoice(id, current);
  }

  async function handleDelete(id: string) {
    "use server";
    await deleteArticle(id);
  }

  async function handleCreateCategory(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    if (name) {
      await createCategory(name);
      revalidatePath("/admin/articles");
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Articles</h1>
          <p className="text-muted-foreground">
            Create, edit and organize your news.
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Categories Sidebar/Box */}
        <div className="md:col-span-1 space-y-4">
          <div className="border rounded-lg p-4 bg-card">
            <h2 className="font-semibold mb-4 flex items-center">
              <FolderPlus className="mr-2 h-4 w-4" />
              Categories
            </h2>
            <form action={handleCreateCategory} className="flex gap-2 mb-4">
              <Input name="name" placeholder="New category..." />
              <Button type="submit" size="sm">
                Add
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: Category) => (
                <Badge key={cat.id} variant="secondary">
                  {cat.name}
                </Badge>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No categories yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="md:col-span-3">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Editors Choice</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      <div>
                        {article.title}
                        <div className="text-xs text-muted-foreground font-normal">
                          by {article.authorId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {article.categoryId ? (
                        <Badge variant="outline">{article.categoryId}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">
                          None
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {article.published ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <form
                        action={async () => {
                          "use server";
                          await toggleEditorsChoice(
                            article.id,
                            article.isEditorsChoice,
                          );
                        }}
                      >
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className={
                            article.isEditorsChoice
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-muted-foreground"
                          }
                        >
                          <Star
                            className={`h-4 w-4 ${article.isEditorsChoice ? "fill-current" : ""}`}
                          />
                        </Button>
                      </form>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteArticle(article.id);
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {articles.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No articles found. Create your first article!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
