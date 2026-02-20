"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  className?: string;
  subscribePath?: string; // default: "/subscribe"
  accountPath?: string; // default: "/account/subscription"
  loginPath?: string; // default: "/login"
  labelOverride?: {
    noSession?: string; // default: "Login"
    withSub?: string; // default: "Manage"
    noSub?: string; // default: "Subscribe"
  };
  size?: "sm" | "default" | "lg";
    variant?: "default" | "secondary" | "outline";
  forceAccountRedirect?: boolean;
};

export default function AccountAccessButton({
  className,
  subscribePath = "/subscribe",
  accountPath = "/account/subscription",
  loginPath = "/login",
  labelOverride,
  size = "sm",
    variant = "default",
  forceAccountRedirect = false, 
}: Props) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [hasActiveSub, setHasActiveSub] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!session) {
        setHasActiveSub(false);
        return;
      }
      try {
        const { data, error } = await authClient.subscription.list();
        if (!cancelled) {
          if (error) {
            toast.error(error.message || "Failed to check subscription");
            setHasActiveSub(false);
            return;
          }
          const list = Array.isArray(data) ? data : [];
          const active = list.some(
            (s) => s?.status === "active" || s?.status === "trialing",
          );
          setHasActiveSub(active);
        }
      } catch {
        if (!cancelled) setHasActiveSub(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const label = useMemo(() => {
    if (isPending) return "…";
    if (!session) return labelOverride?.noSession ?? "Login";
    if (hasActiveSub) return labelOverride?.withSub ?? "Manage";
    return labelOverride?.noSub ?? "Subscribe";
  }, [isPending, session, hasActiveSub, labelOverride]);

  const handleClick = () => {
  if (isPending) return;

  if (!session) {
    toast.error("Please login to continue");
    router.push(loginPath);
    return;
  }

  // ✅ If this is Account button, always go to account page
  if (forceAccountRedirect) {
    router.push(accountPath);
    return;
  }

  // ✅ Subscribe button behavior
  if (hasActiveSub) {
    router.push(accountPath);
    return;
  }

  router.push(subscribePath);
};


  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleClick}
      disabled={isPending}
    >
      {label}
    </Button>
  );
}
