import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const categoryArticles = await prisma.article.findMany({
    where: { category: { name: slug } },
    orderBy: { createdAt: "desc" },
    include: { category: true, author: true },
  });

  const categoryLabels: Record<string, string> = {
    world: "World News",
    politics: "Politics",
    tech: "Tech",
    sports: "Sports",
  };

  const title = categoryLabels[slug] ?? slug;

  return (
    <main
      className="container mx-auto py-10 px-4 
                 bg-white text-slate-900 
                 dark:bg-slate-950 dark:text-slate-100"
    >
      <h1
        className="text-4xl font-bold mb-8 capitalize border-b pb-4 
                   border-slate-300 dark:border-slate-700"
      >
        {title}
      </h1>

      {categoryArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryArticles.map((article, index) => (
            <div
              key={article.id}
              className="border rounded-lg overflow-hidden shadow-sm flex flex-col
                         bg-white dark:bg-slate-900
                         border-slate-300 dark:border-slate-700"
            >
              <div className="relative">
                <Image
                  alt={article.title}
                  src={article.image || "https://images.unsplash.com/photo-1504711432869-0df3058b01ad?q=80&w=1000&auto=format&fit=crop"}
                  width={400} // Optimerad bredd för grid-layout
                  height={300} // Motsvarar h-36/aspect ratio
                  className="w-full h-48 object-cover" // Justerad till full bredd för bättre grid-estetik
                  // Laddar de första två bilderna direkt för bättre LCP (Largest Contentful Paint)
                  priority={index < 2}
                />
              </div>

              <div className="p-4 flex grow flex-col">
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 whitespace-pre-line">
                  {article.content}
                </p>

                <Link
                  href={`/articles/${article.slug}`}
                  className="mt-auto text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No articles found in this category.
        </p>
      )}
    </main>
  );
}
