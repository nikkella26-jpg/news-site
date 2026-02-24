import { incrementView } from "@/actions/increment-view";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Resolve article by ID or Slug
  const article = await prisma.article.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
    include: {
      author: true,
      category: true,
    },
  });

  if (!article) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Article Not Found
        </h1>
        <p className="text-slate-600">
          The article you're looking for doesn't exist or has been moved.
        </p>
      </div>
    );
  }

  // Check subscription status
  const subscription = session?.user?.stripeCustomerId
    ? await prisma.subscription.findFirst({
        where: {
          stripeCustomerId: session.user.stripeCustomerId,
          status: "active",
        },
      })
    : null;

  const hasFullAccess =
    !!subscription ||
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "EDITOR";

  // Increment views and get updated count
  const updatedViews = await incrementView(id);

  // AI Content Fulfillment:
  // If this is a 'stub' article (common from seeding), generate and save full content.
  const { ensureFullArticleContent } =
    await import("@/actions/article-actions");
  const displayContent = await ensureFullArticleContent(
    article.id,
    article.title,
    article.content,
  );

  // If no access, truncate content to a teaser
  const teaserContent = !hasFullAccess
    ? displayContent.slice(0, 300) + "..."
    : displayContent;

  // Determine if we should show ads (Basic Monthly subscribers or non-subscribers)
  // We check the duration between periodStart and periodEnd
  const isYearly =
    subscription?.periodStart && subscription?.periodEnd
      ? new Date(subscription.periodEnd).getTime() -
          new Date(subscription.periodStart).getTime() >
        40 * 24 * 60 * 60 * 1000
      : false;

  const showAds =
    (!hasFullAccess || (!!subscription && !isYearly)) &&
    session?.user?.role !== "ADMIN" &&
    session?.user?.role !== "EDITOR";

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <div className="mb-10 text-center">
        {article.category && (
          <span className="inline-block px-4 py-1.5 bg-primary/5 text-primary text-xs font-black uppercase tracking-[0.3em] rounded-full mb-6 border border-primary/10">
            {article.category.name}
          </span>
        )}
        <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-8 drop-shadow-sm">
          {article.title}
        </h1>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground font-medium border-y border-border/50 py-4 mb-10">
          <div className="flex items-center gap-2">
            <span className="font-black text-foreground uppercase tracking-wider text-[10px]">
              Author
            </span>
            <span>{article.author?.name || "Crucible Admin"}</span>
          </div>
          <div className="w-1 h-1 bg-border rounded-full" />
          <div className="flex items-center gap-2">
            <span className="font-black text-foreground uppercase tracking-wider text-[10px]">
              Release
            </span>
            <span>
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="w-1 h-1 bg-border rounded-full" />
          <div className="flex items-center gap-2">
            <span className="font-black text-foreground uppercase tracking-wider text-[10px]">
              Views
            </span>
            <span className="bg-muted px-2 py-0.5 rounded font-bold text-foreground">
              {updatedViews}
            </span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-video md:aspect-21/9 rounded-[2rem] overflow-hidden shadow-2xl mb-16 ring-1 ring-border/50">
        <Image
          src={
            article.image ||
            "https://images.unsplash.com/photo-1504711432869-0df3058b01ad?q=80&w=1000&auto=format&fit=crop"
          }
          fill
          className="object-cover"
          alt={article.title}
          priority
        />
      </div>

      <div className="max-w-2xl mx-auto font-serif">
        {showAds && (
          <div className="mb-10 p-4 bg-muted/30 border border-dashed border-border rounded-xl text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
              Advertisement
            </span>
            <div className="h-24 flex items-center justify-center text-muted-foreground/50 italic text-sm">
              Upgrade to Premium Yearly to remove advertisements.
            </div>
          </div>
        )}

        <div
          className={`text-xl leading-[1.8] text-foreground/90 whitespace-pre-line selection:bg-cyan-100 selection:text-cyan-900 ${!hasFullAccess ? "mask-bottom" : ""}`}
        >
          {teaserContent}
        </div>

        {!hasFullAccess && (
          <div className="mt-12 p-8 md:p-12 bg-card border-2 border-primary/20 rounded-[2rem] text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-3xl font-black mb-4 tracking-tight">
              This Story is for Subscribers
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg leading-relaxed">
              Get full access to all our exclusive stories, in-depth reports,
              and newsletters by becoming a member today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 font-black uppercase tracking-widest text-xs h-14 w-full sm:w-auto"
              >
                <Link href="/subscribe">Unlock Now — From 99 kr</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 font-black uppercase tracking-widest text-xs h-14 w-full sm:w-auto"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              Cancel anytime. Standard terms apply.
            </p>
          </div>
        )}

        {showAds && hasFullAccess && (
          <div className="mt-16 p-8 bg-muted/20 border border-border rounded-2xl text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-4">
              Sponsored Content
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-muted rounded-lg animate-pulse" />
              <div className="aspect-video bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {hasFullAccess && (
        <div className="mt-20 pt-10 border-t border-border flex justify-center">
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
              Share Story
            </button>
            <button className="px-8 py-3 border border-border rounded-full font-black text-xs uppercase tracking-widest hover:bg-muted transition-colors">
              Bookmark
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
