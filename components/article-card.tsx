import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/generated/prisma";

interface ArticleCardProps {
  article: Article & { excerpt?: string };
  imageSize?: "editor" | "standard";
}

export default function ArticleCard({ article, imageSize }: ArticleCardProps) {
  // Slightly smaller than before
  const imageHeight = imageSize === "editor" ? 240 : 170;
  const imageWidth = 420; // reduced from 500

  return (
    <Link href={`/articles/${article.id}`}>
      <div className="border rounded p-4 hover:shadow cursor-pointer">
        <Image
          src={article.image || "/placeholder-news.jpg"}
          alt={article.title}
          width={imageWidth}
          height={imageHeight}
          className="rounded-lg object-cover"
          priority={imageSize === "editor"}
        />

        <h3 className="text-xl font-semibold mt-2">{article.title}</h3>
        <p className="text-gray-600 text-sm">{article.excerpt}</p>
      </div>
    </Link>
  );
}
