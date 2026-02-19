import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="py-10 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">News Feed</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="border p-4 rounded-lg shadow-sm flex flex-col"
          >
            <div className="relative w-full h-40 mb-4 overflow-hidden rounded">
              <Image
                src={article.image || "/placeholder-news.jpg"}
                className="object-cover"
                alt={article.title}
                fill
              />
            </div>
            <h2 className="font-bold text-lg mb-2 line-clamp-2">
              {article.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {article.content}
            </p>
            <Link
              href={`/articles/${article.id}`}
              className="mt-auto text-blue-500 font-semibold hover:underline"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
