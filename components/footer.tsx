import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 text-center">
      <Link href="/privacy" className="text-sm">
        Privacy Policy
      </Link>
    </footer>
  );
}