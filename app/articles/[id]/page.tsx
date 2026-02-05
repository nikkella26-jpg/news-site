import { articles } from "@/data/articles";
import { incrementView } from "@/actions/increment-view";

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const article = articles.find(a => a.id === id);
  if (!article) {
    notFound();
  }

  // Increment views and get updated count
  const updatedViews = await incrementView(id);

  return (
    <article>
      <h1 className="text-4xl font-bold">{article.title}</h1>

      <p className="text-gray-500 mt-2">
        Views: {updatedViews}
      </p>

      <div className="mt-6 text-lg leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </article>
  );
}