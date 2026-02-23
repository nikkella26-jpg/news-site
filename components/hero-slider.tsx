"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import prisma from "@/lib/prisma";

import { Article } from "@/lib/generated/prisma";

export default function HeroSlider({ articles }: { articles: Article[] }) {

  return (
    <div className="w-full max-w-5xl mx-auto mb-16 px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative group/carousel"
      >
        <div className="rounded-[2rem] border-4 border-border/40 shadow-2xl p-2 bg-background/50 backdrop-blur-sm overflow-hidden ring-1 ring-border/20">
          <CarouselContent className="ml-0">
            {articles.map((article) => (
              <CarouselItem key={article.id} className="pl-0">
                <Link href={`/articles/${article.slug}`}>
                  <div className="relative w-full aspect-video md:aspect-21/9 rounded-[1.5rem] overflow-hidden cursor-pointer group bg-black/90">
                    {/* Background Blur to fill aspect ratio gaps */}
                    <Image
                      src={article.image || "https://images.unsplash.com/photo-1504711432869-0df3058b01ad?q=80&w=1000&auto=format&fit=crop"}
                      alt=""
                      fill
                      className="object-cover blur-3xl opacity-40 scale-125 transition-transform duration-1000 group-hover:scale-150"
                      aria-hidden="true"
                    />

                    {/* Foreground Full Image */}
                    <div className="relative h-full w-full flex items-center justify-center p-4">
                      <Image
                        src={article.image || "https://images.unsplash.com/photo-1504711432869-0df3058b01ad?q=80&w=1000&auto=format&fit=crop"}
                        alt={article.title}
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                        priority
                      />
                    </div>

                    {/* Cinematic Lower-Third Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 bg-linear-to-t from-black/98 via-black/60 to-transparent text-white transform transition-transform duration-500">
                      <div className="max-w-3xl">
                        <div className="flex gap-2 items-center mb-2 md:mb-3">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Featured Story</span>
                        </div>
                        <h2 className="text-xl md:text-3xl font-black mb-2 md:mb-3 leading-tight tracking-tight drop-shadow-2xl">
                          {article.title}
                        </h2>
                        <p className="text-xs md:text-base opacity-70 font-medium line-clamp-1 md:line-clamp-2 max-w-2xl">
                          {article.content.substring(0, 180)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 -left-6 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden md:block">
          <CarouselPrevious className="relative left-0 translate-x-0 h-12 w-12 border-2" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-6 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden md:block">
          <CarouselNext className="relative right-0 translate-x-0 h-12 w-12 border-2" />
        </div>
      </Carousel>
    </div>
  );
}
