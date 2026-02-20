// app/privacy/policypage.tsx


import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-sm leading-relaxed">
      <h1 className="mb-6 text-3xl font-bold">Privacy & Cookies Policy</h1>

      <p className="mb-6">
        My website address is: <strong>https://your-website-url.com</strong>
      </p>

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
