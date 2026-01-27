import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCategories, createArticle } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewArticlePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")
  ) {
    redirect("/");
  }

  const categories = await getCategories();

  async function handleSubmit(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const categoryId = formData.get("categoryId") as string;
    const published = formData.get("published") === "on";
    const isEditorsChoice = formData.get("isEditorsChoice") === "on";
    const image = formData.get("image") as string;

    await createArticle({
      title,
      content,
      categoryId: categoryId || undefined,
      published,
      isEditorsChoice,
      image: image || undefined,
    });

    redirect("/admin/articles");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/articles"
        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Tillbaka till listan
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Skapa Ny Artikel</h1>
      </div>

      <form action={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Innehåll</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Artikelns rubrik"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Bild-URL (valfritt)</Label>
                  <Input
                    id="image"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Brödtext</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Skriv din artikel här..."
                    className="min-h-[400px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inställningar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Kategori</Label>
                  <Select name="categoryId">
                    <SelectTrigger>
                      <SelectValue placeholder="Välj kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="published" name="published" />
                  <Label
                    htmlFor="published"
                    className="font-normal cursor-pointer"
                  >
                    Publicera direkt
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="isEditorsChoice" name="isEditorsChoice" />
                  <Label
                    htmlFor="isEditorsChoice"
                    className="font-normal cursor-pointer"
                  >
                    Editors Choice
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  Spara Artikel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/admin/articles">Avbryt</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
