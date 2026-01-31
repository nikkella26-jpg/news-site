import Image from "next/image";
import Link from "next/link";
import { articles } from "@/data/articles";

export default function ArticlesPage() {
  return (
    <main className="py-10 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">News Feed</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="border p-4 rounded-lg shadow-sm flex flex-col">
            {/* Optimerad Next.js Image */}
            <div className="relative w-full h-40 mb-4">
              <Image
                src={article.image}
                alt={article.title}
                width={500} // Definierad bredd för optimering
                height={270} // Motsvarar h-40 (160px)
                className="w-full h-40 object-cover rounded"
                // Använd 'priority' om artikeln är en av de första på sidan
                priority={article.id <= 3} 
              />
            </div>

            <h2 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h2>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {article.content}
            </p>

            <Link
              href={`/articles/${article.id}`}
              className="mt-auto text-blue-500 font-semibold hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
