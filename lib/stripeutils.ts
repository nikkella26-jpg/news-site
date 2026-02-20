import { headers } from "next/headers";
import { auth } from "./auth";

export async function isSubscriber() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session === null) {
    return null;
  }
  const subscriptions = await auth.api.listActiveSubscriptions({
    headers: await headers(),
  });

  return (
    subscriptions?.find(
      (sub) =>
        (sub.plan === "basic" && sub.status === "active") ||
        sub.status === "trialing",
    ) ?? null
  );
}
