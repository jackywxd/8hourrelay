"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
      <div className="flex flex-col h-full items-center mt-10">
        <div>Payment canceled! Reidirect to home in 5 seconds</div>
        <div>
          <Link className="link link-primary" href="/">
            Go to Home Now
          </Link>
        </div>
      </div>
    );
  }

  if (sessionId && success) {
    return (
      <div className="flex flex-col w-full h-full items-center mt-10">
        <div>Payment successfully! Thank you!</div>
        <div className="flex w-2/3 justify-between pt-10">
          <Link className="link link-primary" href="/register">
            Manage my race
          </Link>
          <Link className="link link-primary" href="/teams">
            Teams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center">
      <div>Invalid Data</div>
      <div>
        <Link className="link link-primary" href="/">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
