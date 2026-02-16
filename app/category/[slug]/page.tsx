import Image from "next/image";
import Link from "next/link";
import React from "react";
import { prisma } from "@/lib/prisma";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Hämtar alla artiklar i kategorin. 
  // Du kan lägga till `take: 20` om du vill begränsa till ett specifikt antal.
  const categoryArticles = await prisma.article.findMany({
    where: {
      category: {
        name: {
          equals: slug,
          mode: 'insensitive',
        },
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const currentCategory = categoryArticles.length > 0 
    ? categoryArticles[0].category?.name 
    : slug;

  return (
    <main className="container mx-auto py-10 px-4 bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="flex justify-between items-end mb-8 border-b pb-4 border-slate-300 dark:border-slate-700">
        <h1 className="text-4xl font-bold capitalize">
          {currentCategory}
        </h1>
        <p className="text-sm text-gray-500">
          Showing {categoryArticles.length} articles
        </p>
      </header>

      {categoryArticles.length > 0 ? (
        /* Ändrat till grid-cols-4 på stora skärmar för att få plats med fler */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryArticles.map((article, index) => (
            <div key={article.id} className="border rounded-lg overflow-hidden shadow-sm flex flex-col bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 transition-transform hover:scale-[1.02]">
              
              <Link href={`/articles/${article.slug}`}>
                <div className="relative cursor-pointer group h-40 overflow-hidden">
                  <Image
                    src={article.image || "/placeholder-news.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                    priority={index < 4}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              </Link>

              <div className="p-4 flex grow flex-col">
                <Link href={`/articles/${article.slug}`}>
                  <h2 className="text-lg font-bold mb-2 line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h2>
                </Link>

                {/* Minskat textstorlek och line-clamp för att hålla korten kompakta */}
                <p className="text-gray-600 dark:text-gray-300 text-xs mb-4 line-clamp-2">
                  {article.content}
                </p>

                <Link
                  href={`/articles/${article.slug}`}
                  className="mt-auto text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">No articles found.</p>
          <Link href="/" className="text-blue-500 underline mt-4 inline-block">Back to start</Link>
        </div>
      )}
    </main>
  );
}
