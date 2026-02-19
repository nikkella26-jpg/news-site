import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/article-card";
import HeroSlider from "@/components/hero-slider";

export default async function LandingPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" }
  });
  const heroArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Correct Prisma field: isEditorsChoice
  const editorsHeadline = articles.find((a) => a.isEditorsChoice);

  return (
    <>
      <HeroSlider articles={heroArticles} />

      <section className="py-10">
        <Link href="/top-stories">
          <h1 className="text-blue-600 text-4xl font-bold cursor-pointer">
            Top Stories
          </h1>
        </Link>
      </section>

      <section>
        <h2 className="text-2xl mb-4 font-bold">Latest News</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.slice(0, 5).map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* --- SINGLE EDITOR'S CHOICE BLOCK --- */}
      <section className="mt-10">
        <h2 className="text-2xl mb-4 font-bold">Editor’s Choice</h2>

        {!editorsHeadline && (
          <p className="text-gray-500">No editor’s choice selected.</p>
        )}

        {editorsHeadline && (
          <Link
            href={`/articles/${editorsHeadline.slug}`}
            className="group block"
          >
            <div className="cursor-pointer">

              {/* IMAGE — optimized with intrinsic width/height */}
              <div className="w-full mb-4">
                <div className="relative w-full overflow-hidden rounded-lg">
                  <Image
                    src={editorsHeadline.image || "/placeholder-news.jpg"}
                    alt={editorsHeadline.title}
                    width={900}      // narrower, optimized
                    height={500}     // maintains aspect ratio
                    className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                {editorsHeadline.title}
              </h3>

              {/* EXCERPT */}
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-3 line-clamp-3">
                {editorsHeadline.content}
              </p>

              {/* LINK */}
              <span className="text-blue-500 font-semibold hover:underline">
                View Page
              </span>
            </div>
          </Link>
        )}
      </section>
    </>
  );
}
