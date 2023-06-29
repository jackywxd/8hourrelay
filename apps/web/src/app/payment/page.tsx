"use client";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id"); // payment succeed
  const success = searchParams.get("success"); // payment succeed
  const canceled = searchParams.get("canceled"); // payment canceled

  // redirect user to home
  useEffect(() => {
    let timeoutId;
    if (canceled) {
      timeoutId = setTimeout(() => {
        router.push("/");
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [canceled]);

  if (canceled) {
    return (
      <div className="flex flex-col w-full h-full items-center mt-10">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="close" className="text-red-500" />
          <EmptyPlaceholder.Title>
            Payment canceled! Reidirect to home in 5 seconds
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
          <Link href="/">
            <Button className="w-full">Go Home Now</Button>
          </Link>
        </EmptyPlaceholder>
      </div>
    );
  }

  if (sessionId && success) {
    return (
      <div className="flex flex-col w-full h-full items-center mt-10">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="trophy" className="text-green-500" />
          <EmptyPlaceholder.Title>
            Payment successful! You have successfully registered for the relay
            race!
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Welcome to the game! Let's go!
          </EmptyPlaceholder.Description>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/account/myrace">
              <Button className="w-full">My Race</Button>
            </Link>
            <Link href="/account">
              <Button className="w-full">My Account</Button>
            </Link>
          </div>
        </EmptyPlaceholder>
      </div>
    );
  }

  redirect("/");
}
