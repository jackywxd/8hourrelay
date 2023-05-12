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
    if (canceled) {
      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  }, [canceled]);

  if (canceled) {
    return (
      <div className="flex flex-col h-full items-center">
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
      <div className="flex flex-col h-full items-center">
        <div>Payment successfully! You can manage your registration now</div>
        <div className="pt-10">
          <Link className="link link-primary" href="/register">
            Manage your registration
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
