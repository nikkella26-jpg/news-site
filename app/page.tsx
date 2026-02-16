import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma"; // Säkerställ att sökvägen till din prisma-klient är rätt
import ArticleCard from "@/components/article-card";
import HeroSlider from "@/components/hero-slider";

export default async function LandingPage() {
  // Hämta ALLA artiklar direkt från databasen (där slug finns)
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc' // Valfritt: visar de senaste nyheterna först
    }
  });

  const editorsHeadline = articles.find((a) => a.editorPick);

  return (
     <>
      <HeroSlider />

      <section className="py-10">
        <Link href="/top-stories">
          <h1 className="text-blue-600 text-4xl font-bold cursor-pointer">
            Top Stories
          </h1>
        </Link>
      </section>

      <section>
        <h2 className="text-2xl mb-4 font-bold">Latest News</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.slice(0, 5).map((a) => (
            // Här skickas nu artikeln från DB (med slug) in i ArticleCard
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl mb-4 font-bold">Editor’s Choice</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {articles
            .filter((a) => a.editorPick)
            .map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
        </div>
      </section>

      {editorsHeadline && (
        <section className="mt-10 p-6 bg-gray-100 dark:bg-zinc-900 rounded-lg shadow">
          <h3 className="text-3xl mb-6 font-bold dark:text-white">
            Editor’s Choice Headline
          </h3>

          {/* Nu kommer editorsHeadline.slug vara exakt det du ser i Prisma Studio */}
          <Link href={`/articles/${editorsHeadline.slug}`} className="group">
            <div className="cursor-pointer">
              <div className="relative w-full h-[275px] mb-4">
                 <Image
                  src={editorsHeadline.image || "/placeholder-news.jpg"}
                  alt={editorsHeadline.title}
                  fill
                  className="rounded-lg object-cover group-hover:opacity-90 transition-opacity"
                  priority
                />
              </div>

              <h4 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                {editorsHeadline.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-4 line-clamp-3">
                {editorsHeadline.content}
              </p>
              
              <span className="text-blue-500 font-semibold hover:underline">
                Read More
              </span>
            </div>
          </Link>
        </section>
      )}
    </>
  );
}
