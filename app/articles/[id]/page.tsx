
import { articles } from "@/data/articles";
import { incrementView } from "@/actions/increment-view";

export default async function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;        // ← FIX
  const id = resolved.id;               // ← FIX

  const article = articles.find(a => a.id === id);
  if (!article) return <p>Not found</p>;

  const views = await incrementView(article.id);

  return (
    <article>
      <h1 className="text-4xl font-bold">{article.title}</h1>
      <p className="text-sm text-muted-foreground">Views: {views}</p>
      <div className="mt-6">{article.content}</div>
    </article>
  );
}