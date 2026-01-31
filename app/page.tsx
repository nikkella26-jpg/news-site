import Link from "next/link";
import Image from "next/image";
import { articles } from "@/data/articles";
import ArticleCard from "@/components/article-card";

export default function LandingPage() {
  const editorsHeadline = articles.find(a => a.editorPick);

  return (
    <>
      <section className="py-10">
        <Link href="/top-stories" className="text-blue-600 text-4xl font-bold hover:underline">
          Top Stories
        </Link>
      </section>

      <section>
        <h2 className="text-2xl mb-4 font-semibold">Latest News</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.slice(0, 5).map(a => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl mb-4 font-semibold">Editor’s Choice</h2>
        {articles
          .filter(a => a.editorPick)
          .map(a => (
            <ArticleCard key={a.id} article={a} />
          ))}
      </section>

      {editorsHeadline && (
        <section className="mt-10 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-3xl mb-4 dark:text-white font-bold">Editor’s Choice Headline</h3>

          <Link href={`/article/${editorsHeadline.id}`} className="block group">
            {/* Optimerad Image med fasta dimensioner */}
            <Image
              src={editorsHeadline.image}
              alt={editorsHeadline.title}
              width={400} 
              height={270}
              priority
              className="rounded-lg object-cover mb-4 h-auto transition-opacity group-hover:opacity-90"
            />

            <h4 className="text-2xl font-semibold mb-4 group-hover:text-blue-600">
              {editorsHeadline.title}
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              {editorsHeadline.excerpt}
            </p>
          </Link>
        </section>
      )}
    </>
  );
}
