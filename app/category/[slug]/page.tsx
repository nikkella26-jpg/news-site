import React from "react";
import { articles } from "@/data/articles"; // Ensure this path is correct
import Link from "next/link";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Filter articles where category matches the URL slug (e.g., "world")
  const categoryArticles = articles.filter(
    (a) => a.category?.toLowerCase() === slug.toLowerCase()
  );

  const categoryLabels: Record<string, string> = {
    world: "World News",
    politics: "Politics",
    tech: "Tech",
    sports: "Sports",
  };

  const title = categoryLabels[slug] ?? slug;

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 capitalize border-b pb-4">{title}</h1>
      
      {categoryArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryArticles.map((article) => (
            <div key={article.id} className="border rounded-lg overflow-hidden shadow-sm flex flex-col">
              <img 
                src={article.image} 
                className="w-48 h-36 object-cover rounded-lg"
                alt={article.title} 
              />
              <div className="p-4 flex flex-grow flex-col">
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 whitespace-pre-line">
                  {article.content}
                </p>
                <Link 
                  href={`/articles/${article.id}`} 
                  className="mt-auto text-blue-600 font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No articles found in this category.</p>
      )}
    </main>
  );
}
