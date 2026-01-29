import { articles } from "@/data/articles";
import { incrementView } from "@/actions/increment-view";

export default async function ArticleDetail({
  params,
}: {
  params: { id: string };
}) {
  const article = articles.find(a => a.id === params.id);
  if (!article) return <p>Not found</p>;

  const views = await incrementView(article.id);

  return (
    <article>
      <h1 className="text-4xl font-bold">{article.title}</h1>
      <p className="text-sm text-muted-foreground">
        Views: {views}
      </p>
      <div className="mt-6 text-lg leading-relaxed whitespace-pre-line"></div>
      <div className="mt-6">{article.content}</div>
    </article>
  );
}