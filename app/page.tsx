import Link from "next/link";
import Image from "next/image";
import { articles } from "@/data/articles";
import ArticleCard from "@/components/article-card";
import HeroSlider from "@/components/hero-slider";

export default function LandingPage() {
  const editorsHeadline = articles.find((a) => a.editorPick);

  return (
<<<<<<< Updated upstream
     <>
      <HeroSlider />
=======
    <>
      <HeroSlider articles={articles} />
>>>>>>> Stashed changes

      <section className="py-10">
        <Link href="/top-stories">
          <h1 className="text-blue-600 text-4xl font-bold cursor-pointer">
            Top Stories
          </h1>
        </Link>
      </section>


      <section>
        <h2 className="text-2xl mb-4">Latest News</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.slice(0, 5).map((a) => (
            <ArticleCard key={a.id} article={a} imageSize={undefined} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl mb-4">Editor’s Choice</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {articles
            .filter((a) => a.editorPick)
            .map((a) => (
              <ArticleCard key={a.id} article={a} imageSize={undefined} />
            ))}
        </div>
      </section>

      {editorsHeadline && (
        <section className="mt-10 p-6 bg-gray dark:bg-black-800 rounded-lg shadow">
          <h3 className="text-3xl mb-4 dark:text-white">
            Editor’s Choice Headline
          </h3>

          <Link href={`/articles/${editorsHeadline.id}`}>
            <div className="cursor-pointer">
              <Image
                src={editorsHeadline.image}
                alt={editorsHeadline.title}
                width={500}
                height={275}
                className="rounded-lg object-cover mb-4"
                priority
              />

              <h4 className="text-2xl font-semibold mb-4">
                {editorsHeadline.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                {editorsHeadline.content}
              </p>
            </div>
          </Link>
        </section>
      )}
    </>
  );
}
