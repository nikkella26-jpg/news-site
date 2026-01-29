import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import Link from "next/link";
import Image from "next/image";

// In Next.js 15, params is a Promise
export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ id?: string[] }>;
}) {
  const resolvedParams = await params;
  const idArray = resolvedParams.id; // This will be undefined at /articles

  // 1. DETAIL VIEW: If there is an ID in the URL
  if (idArray && idArray.length > 0) {
    const articleId = idArray[0];
    const article = articles.find((a) => a.id.toString() === articleId);

    if (!article) return notFound();

    return (
      <article className="py-10 max-w-3xl mx-auto px-4">
        <Link
          href="/articles"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← Back to Articles
        </Link>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-600 mb-6">{article.date}</p>
        <Image
          src={article.image}
          alt={article.title}
          className="w-full rounded mb-6"
          width={100}
          height={100}
        />
        <p className="text-lg leading-relaxed whitespace-pre-line">
          {article.content}
        </p>
      </article>
    );
  }

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
