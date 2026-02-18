import { prisma } from "@/lib/prisma"; // Din Prisma-instans
import ArticleCard from "@/components/article-card";

export default async function TopStoriesPage() {
  // 1. Hämta de mest populära eller senaste artiklarna från databasen
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc' // Eller sortera på 'views' om du vill ha faktiska Top Stories
    }
  });

  return (
    <section className="py-10">
      <h1 className="text-3xl font-bold mb-6">Top Stories</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((a) => (
          // 2. Nu skickas artikeln från DB (med slug) till ArticleCard
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}