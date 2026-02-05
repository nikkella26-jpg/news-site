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

          {/* Newsfeed Button */}
          <Link
            href="/articles"
            className="font-semibold text-blue-600 hover:underline"
          >
            Newsfeed
          </Link>

          {categories.map((cat) => (
            <Link key={cat} href={`/category/${cat.toLowerCase()}`}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Right side: Subscribe + Theme toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/subscribe"
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Subscribe
          </Link>

          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}