import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/generated/prisma";

interface ArticleCardProps {
  article: Article & { excerpt?: string };
  imageSize?: "editor" | "standard";
}

export default function ArticleCard({ article, imageSize }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      aria-label={`Read full article: ${article.title}`}
    >
      <div className="group border rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-card/50 border-border focus-within:ring-2 focus-within:ring-primary outline-none">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-muted text-center flex items-center justify-center">
          <Image
            src={
              article.image ||
              "https://images.unsplash.com/photo-1504711432869-0df3058b01ad?q=80&w=1000&auto=format&fit=crop"
            }
            alt="" // Decorative since we have title and aria-label
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={imageSize === "editor"}
          />
        </div>

        <h3 className="text-xl font-semibold mt-2 group-hover:text-primary transition-colors">{article.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
      </div>
    </Link>
  );
}
