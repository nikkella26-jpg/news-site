import { articles } from "@/data/articles";
import Link from "next/link";
import Image from "next/image";

// In Next.js 15, params is a Promise
export default async function ArticlesPage() {
  // 2. LIST VIEW (GRID): If there is NO ID in the URL (Matches /articles)
  return (
    <main className="py-10 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">News Feed</h1>

      {/* Grid configuration: 3 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="border p-4 rounded-lg shadow-sm flex flex-col"
          >
            <Image
              src={article.image}
              className="w-full h-40 object-cover rounded mb-4"
              alt={article.title}
              width={100}
              height={100}
            />
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
//