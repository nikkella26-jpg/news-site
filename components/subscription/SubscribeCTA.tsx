"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function SubscribeCTA({ className, children }: Props) {
  const session = authClient.useSession();
  const router = useRouter();

  const handleClick = () => {
    const subscribePath = "/subscribe";
    if (session.data) {
      router.push(subscribePath);
    } else {
      router.push(`/login?redirect=${subscribePath}`);
    }
  };

  return (
    <Button onClick={handleClick} className={className}>
      {children ?? "Subscribe"}
    </Button>
  );
}
