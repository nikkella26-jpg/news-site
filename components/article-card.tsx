import Image from "next/image";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  image: string;
  excerpt?: string;
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className="border rounded p-4 hover:shadow cursor-pointer">
        <Image
          src={article.image}
          alt={article.title}
          width={500}
          height={500}
          className="w-3/4 h-48 object-cover rounded-lg"
        />
        <h3 className="text-xl font-semibold mt-2">{article.title}</h3>
        <p className="text-gray-600 text-sm">{article.excerpt}</p>
      </div>
    </Link>
  );
}
