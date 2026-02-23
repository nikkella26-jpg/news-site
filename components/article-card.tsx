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
    <Link href={`/articles/${article.slug}`}>
      <div className="group border rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm border-border">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-muted">
          <Image
            src={article.image || "https://images.unsplash.com/photo-1504711432869-0df3058b01ad?q=80&w=1000&auto=format&fit=crop"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={imageSize === "editor"}
          />
        </div>

        <h3 className="text-xl font-semibold mt-2">{article.title}</h3>
        <p className="text-gray-600 text-sm">{article.excerpt}</p>
      </div>
    </Link>
  );
}
