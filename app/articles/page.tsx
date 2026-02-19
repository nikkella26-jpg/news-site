import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      author: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-4">
            The News <span className="text-blue-600">Feed</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay updated with the latest stories from around the world, curated by our editors.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100"
            >
              {/* Image Container */}
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={article.image || "https://images.unsplash.com/photo-1504711432869-0df3058b01ad?q=80&w=1000&auto=format&fit=crop"}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={article.image ? article.title : "No picture available"}
                  fill
                />
                {article.category && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-blue-600 rounded-full shadow-sm">
                      {article.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-xs font-medium text-slate-500">
                    {article.author.name}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {article.title}
                </h2>

                <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {article.content}
                </p>

                <div className="mt-auto flex items-center text-blue-600 font-bold text-sm group/btn">
                  Read Full Story
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

