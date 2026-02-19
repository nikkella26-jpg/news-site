import { prisma } from "@/lib/prisma";
import { incrementView } from "@/actions/increment-view";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import slugify from "slugify";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetail({ params }: PageProps) {
  // 1. Unwrappa params
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;

  if (!rawSlug) return notFound();

  // 2. Rengör sluggen (hantera %20, åäö, mellanslag etc)
  const decodedSlug = decodeURIComponent(rawSlug);
  const cleanSlug = slugify(decodedSlug, { lower: true, strict: true });

  // 3. Sök i databasen med hög tolerans
  const article = await prisma.article.findFirst({
    where: {
      OR: [
        { slug: cleanSlug },     // Bästa träff: dashed-slug
        { slug: decodedSlug },   // Om sluggen råkar ha mellanslag i DB
        { id: rawSlug }          // Om det är ett UUID
      ]
    }
  });

  // 4. Om ingen träff i DB
  if (!article) {
    console.error(`Article not found for slug: ${rawSlug} (Cleaned: ${cleanSlug})`);
    return notFound();
  }

  // 4. Om de använde ID i URL:en, redirecta till den snygga slug-URL:en
  if (rawSlug === article.id) {
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