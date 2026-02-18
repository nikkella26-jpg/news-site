import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function CategoryLayout({
  children,
  params,
}: CategoryLayoutProps) {
  const { slug } = await params;

  // Hämta t.ex. 5 populära artiklar oavsett kategori för att fylla ut sidan
  const trendingArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { views: 'desc' },
  });

  const categoryLabels: Record<string, string> = {
    world: "World",
    politics: "Politics",
    tech: "Tech",
    sports: "Sports",
  };

  const title = categoryLabels[slug.toLowerCase()] ?? slug;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <header className="bg-blue-800 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <p className="text-blue-200 text-xs uppercase tracking-widest font-bold mb-1">Explore Category</p>
          <h1 className="text-4xl font-extrabold">{title}</h1>
        </div>
      </header>

      {/* Grid-layout: Huvudinnehåll (children) till vänster, Trending till höger */}
      <div className="grow container mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Huvudflödet för kategorin (denna fylls av din page.tsx) */}
        <main className="lg:col-span-3">
          {children}
        </main>

        {/* Sidebar: Visar fler artiklar för att hålla användaren engagerad */}
        <aside className="lg:col-span-1 border-l dark:border-slate-800 pl-6 hidden lg:block">
          <h2 className="text-xl font-bold mb-6 border-b pb-2 dark:text-white">Trending Stories</h2>
          <div className="space-y-6">
            {trendingArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 shrink-0">
                    <Image
                      src={article.image || "/placeholder-news.jpg"}
                      alt={article.title}
                      fill
                      className="rounded object-cover group-hover:opacity-80"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight group-hover:text-blue-600 dark:text-slate-200">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{article.views} views</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <footer className="bg-gray-200 text-center p-6 text-slate-900 dark:bg-slate-900 dark:text-slate-100 border-t dark:border-slate-800">
        <p className="font-semibold text-sm">© 2026 The News Site</p>
        <p className="text-xs text-gray-500 mt-1">The Crucible Coders - Premium Journalism</p>
      </footer>
    </div>
  );
}