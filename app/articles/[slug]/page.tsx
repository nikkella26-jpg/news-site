import { prisma } from "@/lib/prisma";
import { incrementView } from "@/actions/increment-view";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetail({ params }: PageProps) {
  // 1. Unwrappa params (Next.js 16)
  const resolvedParams = await params;
  const slugValue = resolvedParams.slug;

  if (!slugValue) return notFound();

  // 2. Sök i databasen
  // Vi kollar både fältet 'slug' och 'id' i din tabell
  const article = await prisma.article.findFirst({
    where: {
      OR: [
        { slug: slugValue },
        { id: slugValue }
      ]
    }
  });

  // 3. Om ingen träff i DB
  if (!article) {
    return notFound();
  }

  // 4. Om de använde ID i URL:en, redirecta till den snygga slug-URL:en
  if (slugValue === article.id) {
    return redirect(`/articles/${article.slug}`);
  }

  // 5. Uppdatera visningar
  const updatedViews = await incrementView(article.id);

  return (
    <article className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <span>Visningar: {updatedViews}</span>
        <span>•</span>
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>

      {article.image && (
        <div className="relative w-full h-[450px] mb-8">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="rounded-lg shadow-md object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-lg leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </article>
  );
}
