import PlansList from "@/components/subscription/PlansList";

export const metadata = {
  title: "Subscribe",
  description: "Choose a subscription plan",
};

export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Subscribe</h1>
          <p className="mt-2 text-zinc-600">
            Choose a plan below. You must be logged in to subscribe. (This is a UI
            mock — Stripe integration comes next.)
          </p>
        </header>

        <section>
          <h2 className="sr-only">Subscription Plans</h2>
          <PlansList />
        </section>
      </div>
    </main>
  );
}
