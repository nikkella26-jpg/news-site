/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

type StripeInterval = "month" | "year" | "unknown";

export default function AccountSubscriptionPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [interval, setInterval] = useState<StripeInterval>("unknown");
  const [isLoading, setIsLoading] = useState(true);
  const hasSession = !!session;

  // Fetch subs from BetterAuth, then fetch real interval from Stripe via our single manage route
  useEffect(() => {
    if (isSessionPending) return;

    if (!hasSession) {
      setSubscriptions([]);
      setInterval("unknown");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const res = await authClient.subscription.list();
        const list = Array.isArray(res?.data) ? (res!.data as any[]) : [];

        if (!isMounted) return;

        setSubscriptions(list);

        if (list.length > 0 && list[0]?.stripeSubscriptionId) {
          const resp = await fetch("/api/subscription/manage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "interval",
              stripeSubscriptionId: list[0].stripeSubscriptionId,
            }),
          });

          const json = await resp.json().catch(() => ({}));
          if (!isMounted) return;

          if (resp.ok) {
            setInterval((json?.interval as StripeInterval) || "unknown");
          } else {
            setInterval("unknown");
          }
        } else {
          setInterval("unknown");
        }
      } catch (e) {
        console.error("Subscription load error:", e);
        if (!isMounted) return;
        setSubscriptions([]);
        setInterval("unknown");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [hasSession, isSessionPending]);

  const getStatusBadge = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Active
          </Badge>
        );
      case "trialing":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" /> Trialing
          </Badge>
        );
      case "canceled":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" /> Canceled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || "unknown"}</Badge>;
    }
  };

  const refetchForWebhook = async () => {
    // brief polling to reflect webhook-updated fields like cancelAtPeriodEnd
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 1200));
      const { data } = await authClient.subscription.list();
      const list = Array.isArray(data) ? data : [];
      if (list.length) {
        setSubscriptions(list);
        if (list[0]?.cancelAtPeriodEnd) break;
      }
    }
  };

  const handleCancel = async (sub: any) => {
    try {
      const resp = await fetch("/api/subscription/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          stripeSubscriptionId: sub?.stripeSubscriptionId,
        }),
      });

      const json = await resp.json().catch(() => ({}));
      if (!resp.ok)
        throw new Error(json?.error || "Failed to schedule cancellation.");

      if (json?.alreadyCanceled || json?.cancel_at_period_end) {
        toast.success(
          "Cancellation scheduled. You keep access until the period ends.",
        );
      } else {
        toast.info("Cancellation was already scheduled.");
      }

      // reflect in UI without a full reload
      await refetchForWebhook();
    } catch (e: any) {
      toast.error(e?.message || "Cancel failed.");
    }
  };

  const handleSwitch = async (sub: any) => {
    try {
      const wantAnnual = interval === "month";

      const resp = await fetch("/api/subscription/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "switch",
          customerId: sub?.stripeCustomerId,
          annual: wantAnnual,
        }),
      });

      const json = await resp.json().catch(() => ({}));
      if (!resp.ok || !json?.url) {
        throw new Error(
          json?.error || "Failed to create Stripe Checkout for switching plan.",
        );
      }

      toast.info(
        wantAnnual
          ? "Redirecting to switch to Annual…"
          : "Redirecting to switch to Monthly…",
      );
      window.location.href = json.url as string;
    } catch (e: any) {
      toast.error(e?.message || "Switch failed.");
    }
  };

  // ---------- Render ----------

  if (isSessionPending || (isLoading && hasSession)) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Subscription Status</h1>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Subscription Status</h1>
        <Card>
          <CardHeader>
            <CardTitle>Please log in</CardTitle>
            <CardDescription>
              You must log in to manage your subscription.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() =>
                (window.location.href = "/login?redirect=/account/subscription")
              }
            >
              Log In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Subscription Status</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You are currently on the free plan.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => (window.location.href = "/subscribe")}>
              Subscribe Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const sub = subscriptions[0];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subscription Status</h1>

      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{sub?.plan} Plan</CardTitle>
          <CardDescription>
            {interval === "year" ? "Annual Billing" : "Monthly Billing"}{" "}
            {getStatusBadge(sub?.status)}
            {sub?.cancelAtPeriodEnd && (
              <span className="ml-2 text-amber-600">
                • Cancels at period end
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <p>
            <strong>Next Billing Date:</strong>{" "}
            {sub?.periodEnd
              ? new Date(sub.periodEnd).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="text-xs text-zinc-500">
            Subscription ID: {sub?.stripeSubscriptionId || "N/A"}
          </p>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button variant="outline" onClick={() => handleSwitch(sub)}>
            {interval === "year" ? "Switch to Monthly" : "Switch to Annual"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleCancel(sub)}
            disabled={!!sub?.cancelAtPeriodEnd}
            title={
              sub?.cancelAtPeriodEnd
                ? "Cancellation already scheduled"
                : undefined
            }
          >
            {sub?.cancelAtPeriodEnd
              ? "Cancellation Scheduled"
              : "Cancel Subscription"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
