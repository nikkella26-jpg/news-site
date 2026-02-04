"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

const categories = ["World", "Politics", "Tech", "Sports"];

export default function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto flex items-center justify-between py-4">
        {/* Left side: Logo + categories */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            News
          </Link>

          <Link href="/weather">Weather</Link>

          {categories.map((cat) => (
            <Link key={cat} href={`/category/${cat.toLowerCase()}`}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Right side: Theme toggle */}
        <ModeToggle />
      </nav>
    </header>
  );
}
