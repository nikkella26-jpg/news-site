
import { incrementView } from "@/actions/increment-view";
import prisma from "@/lib/prisma";
import Image from "next/image";

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return <p>Not found</p>;

  // Increment views and get updated count
  const updatedViews = await incrementView(id);

  return (
    <article>

      <h1 className="text-4xl font-bold">{article.title}</h1>
      <Image
        src={article.image || "https://images.unsplash.com/photo-1504711432869-0df3058b01ad?q=80&w=1000&auto=format&fit=crop"}
        className="object-cover"
        alt={article.title}
        width={500}
        height={500}
      />
      <p className="text-gray-500 mt-2">
        Views: {updatedViews}
      </p>

      <div className="mt-6 text-lg leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </article>
  );
}