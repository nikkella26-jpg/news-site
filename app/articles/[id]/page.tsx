import { articles } from "@/data/articles";

export default async function ArticleDetail({
  params,
}: {
  params: { id: string };
}) {
  const article = articles.find(a => a.id === params.id);
  if (!article) return <p>Not found</p>;


  return (
    <article>
      <h1 className="text-4xl font-bold">{article.title}</h1>
      <div className="mt-6 text-lg leading-relaxed whitespace-pre-line">{article.content}</div>
    </article>
  );
}