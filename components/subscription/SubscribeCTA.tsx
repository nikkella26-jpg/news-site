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
    if (session.data) {
      router.push("/subscribe");
    } else {
      router.push("/login?redirect=/subscribe");
    }
  };

  return (
    <Button onClick={handleClick} className={className ?? "bg-blue-600 hover:bg-blue-700"}>
      {children ?? "Subscribe"}
    </Button>
  );
}
