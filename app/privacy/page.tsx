// app/privacy/policypage.tsx


import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-sm leading-relaxed">
      <h1 className="mb-6 text-3xl font-bold">Privacy & Cookies Policy</h1>

      <p className="mb-8">
        This news platform is a development project by <strong>Crucible Coders</strong>.
      </p>

      <section className="mb-10 p-6 rounded-3xl bg-muted/30 border border-border/50">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Project Team & Mentors</h2>
        <div className="space-y-4">
          <div>
            <span className="text-secondary-foreground font-bold uppercase text-[10px] tracking-widest block mb-1">Mentors & Scrum Managers</span>
            <p className="text-base">Alexander Sjösten and Sebastian Vallin</p>
          </div>
          <div>
            <span className="text-secondary-foreground font-bold uppercase text-[10px] tracking-widest block mb-1">Crucible Coders Team</span>
            <p className="text-base font-medium">
              Santhoshi Sampatirao, Geetha Mamadi, Christopher Coble, Niklas Arvidsson, and Manoj Axelsson
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Comments</h2>
        <p>
          When visitors leave comments on the site, we collect the data shown in
          the comments form, and also the visitor’s IP address and browser user
          agent string to help spam detection.
        </p>
        <p className="mt-2">
          An anonymized string created from your email address (also called a
          hash) may be provided to the Gravatar service to see if you are using
          it. The Gravatar service privacy policy is available at{" "}
          <Link
            href="https://automattic.com"
            className="text-blue-600 hover:underline"
            target="_blank"
          >
            https://automattic.com
          </Link>.
          After approval of your comment, your profile picture is visible to the public in the context of your comment.
        </p>
      </section>

      {/* ... resten av dina sektioner ... */}
      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Cookies</h2>
        <p>
          If you leave a comment on our site, you may opt in to saving your name,
          email address, and website in cookies.
        </p>
      </section>
      {/* Osv... */}
    </main>
  );
}
