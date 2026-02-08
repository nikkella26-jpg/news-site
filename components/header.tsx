"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import WeatherWidget from "./weatherWidget";

const categories = ["World", "Politics", "Tech", "Sports"];

export default function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Left side: Logo + categories */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Home
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

        {/* Center: Weather */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <WeatherWidget />
        </div>

        {/* Right side: Login + Subscribe + toggle mode */}
        <div className="flex items-center gap-8 pl-2">
          <Link
            href="/login"
            className="px-4 py-2 rounded-md border bg-blue-600 text-white font-semibold hover:bg-blue-7000 transition"
          >
            Login
          </Link>

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





