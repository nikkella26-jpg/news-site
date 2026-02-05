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
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold">Category: {title}</h1>
      </header>

      <main className="grow container mx-auto p-6">
        {children}
      </main>

      <footer className="bg-gray-200 text-center p-4 
                   text-slate-900 
                   dark:bg-slate-900 dark:text-slate-100">
  <p>© 2026 The News Site - The Crucible Coders</p>
</footer>
    </div>
  );
}
