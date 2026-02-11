"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle, generateAIContent } from "../actions";
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
import { toast } from "sonner";
import { Sparkles as SparklesIcon, Loader2 as LoaderIcon } from "lucide-react";

export default function ArticleForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [published, setPublished] = useState(false);
  const [isEditorsChoice, setIsEditorsChoice] = useState(false);

  async function handleGenerateAI() {
    if (!title) {
      toast.error("Please enter a title first to generate content");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await generateAIContent(title);
      setContent(generatedContent);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Client error generating AI content:", error);
      toast.error(
        "Failed to generate content. Check your API key and server logs.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createArticle({
        title,
        content,
        categoryId: categoryId || undefined,
        published,
        isEditorsChoice,
        image: image || undefined,
      });
      toast.success("Article created!");
      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      toast.error("Failed to create article");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content">Content</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateAI}
                    disabled={isGenerating || !title}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <SparklesIcon className="h-4 w-4" />
                    )}
                    Generate with AI
                  </Button>
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article here..."
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
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select onValueChange={setCategoryId} value={categoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
                <Checkbox
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setPublished(!!checked)}
                />
                <Label
                  htmlFor="published"
                  className="font-normal cursor-pointer"
                >
                  Publish immediately
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isEditorsChoice"
                  checked={isEditorsChoice}
                  onCheckedChange={(checked) => setIsEditorsChoice(!!checked)}
                />
                <Label
                  htmlFor="isEditorsChoice"
                  className="font-normal cursor-pointer"
                >
                  Editors Choice
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Article"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href="/admin/articles">Cancel</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
