"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/generated/prisma";

interface ArticleCardProps {
  // Vi lägger till slug: string för att säkerstäxtälla att TS vet att den finns
  article: Article & { excerpt?: string; slug: string };
  imageSize?: "editor" | "standard";
}

export default function ArticleCard({ article, imageSize }: ArticleCardProps) {
  const router = useRouter();

  // Konstruera URL:en baserat på din slug i Prisma Studio
  // Exempel: /articles/worlds-fastest-hot-dog-eater-joey-ate-it
  const articlePath = `/articles/${article.slug}`;

  const handleNavigation = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Increment view via API (använd ID för databasen, det är säkrast)
    try {
      await fetch(`/api/articles/${article.id}/view`, { method: "POST" });
    } catch (err) {
      console.warn("View update failed", err);
    }

    // Navigera till slug-URL:en
    router.push(articlePath);
  };

  return (
    <div className="border rounded p-4 hover:shadow flex flex-col h-full bg-white dark:bg-zinc-900">
      {/* Bild-länk */}
      <div onClick={handleNavigation} className="cursor-pointer mb-3 group">
        <Image
          src={article.image || "/placeholder-news.jpg"}
          alt={article.title}
          width={420}
          height={imageSize === "editor" ? 240 : 170}
          className="rounded-lg object-cover group-hover:opacity-90 transition-opacity"
          priority={imageSize === "editor"}
        />
      </div>

      {/* Titel-länk */}
      <div onClick={handleNavigation} className="cursor-pointer">
        <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {article.excerpt}
      </p>

      {/* Read More - Länkar direkt till din slug */}
      <Link
        href={articlePath}
        onClick={handleNavigation}
        className="mt-auto text-blue-500 font-semibold hover:underline"
      >
        Read More
      </Link>
    </div>
  );
}
