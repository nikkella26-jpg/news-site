"use client";

import Image from "next/image";
import Link from "next/link";
import { articles } from "@/data/articles";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HeroSlider() {
  const latest = articles.slice(0, 5);

  return (
    <div className="w-full max-w-5xl mx-auto mb-10">
      <Carousel className="w-full">
        <CarouselContent>
          {latest.map((article) => (
            <CarouselItem key={article.id}>
              <Link href={`/articles/${article.id}`}>
                <div className="relative w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden cursor-pointer">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-6 left-6 text-white max-w-xl">
                    <h2 className="text-3xl font-bold mb-2">
                      {article.title}
                    </h2>
                    <p className="text-lg opacity-90">{article.excerpt}</p>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}