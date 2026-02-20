import PlansList from "@/components/subscription/PlansList";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Subscribe",
  description: "Choose a subscription plan",
};

export default async function SubscribePage() {
  const requestHeaders = await headers();
  // Get the current session via Better Auth adapter
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    redirect("/login?redirect=/subscribe");
  } // List active subscriptions through Better Auth API

  const subscriptions = await auth.api.listActiveSubscriptions({
    headers: requestHeaders,
  });

  const activeSubscription = subscriptions?.find(
    (sub) =>
      (sub.plan === "basic" && sub.status === "active") ||
      sub.status === "trialing",
  );
  // Redirect users who already have an active subscription
  if (activeSubscription) {
    redirect("/account/subscription");
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Subscribe</h1>
          <p className="mt-2 text-zinc-600">Choose a plan below.</p>
        </header>

        <section>
          <PlansList />
        </section>
      </div>
    </div>
  );
}
