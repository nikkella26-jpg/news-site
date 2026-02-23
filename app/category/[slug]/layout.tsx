import React from "react";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function CategoryLayout({
  children,
  params,
}: CategoryLayoutProps) {
  const { slug } = await params; // ✅ REQUIRED in Next 16

  const categoryLabels: Record<string, string> = {
    world: "World",
    politics: "Politics",
    tech: "Tech",
    sports: "Sports",
  };

  const title = categoryLabels[slug] ?? slug;

  return (
    <div className="py-10">
      <div className="mb-10 pb-6 border-b border-border/50">
        <h1 className="text-5xl font-black text-foreground tracking-tight">
          {title} News
        </h1>
        <div className="h-1.5 w-16 bg-primary mt-4 rounded-full" />
      </div>

      <div className="w-full">{children}</div>
    </div>
  );
}
