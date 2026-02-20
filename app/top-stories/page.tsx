import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/article-card";

export default async function TopStoriesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <section className="py-10">
      <h1 className="text-3xl font-bold mb-6">Top Stories</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}