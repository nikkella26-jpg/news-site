import { articles } from "@/data/articles";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default function ArticleDetail({ params }: Props) {
  const article = articles.find((a) => a.id === params.id);

  if (!article) {
    notFound();
  }

  return (
    <article>
      <h1 className="text-4xl font-bold">{article.title}</h1>
      <div className="mt-6 text-lg leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </article>
  );
}
