import Link from "next/link";

export default function ArticleCard({ article }) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className="border rounded p-4 hover:shadow cursor-pointer">
        <img
          src={article.image}
          alt={article.title}
          className="w-3/4 h-48 object-cover rounded-lg"
        />
        <h3 className="text-xl font-semibold mt-2">{article.title}</h3>
        <p className="text-gray-600 text-sm">{article.excerpt}</p>
      </div>
    </Link>
  );
}