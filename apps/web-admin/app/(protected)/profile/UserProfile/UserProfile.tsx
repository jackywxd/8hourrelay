"use client";

import * as React from "react";
import { useAuth } from "@/auth/context";
import { useFirebaseAuth } from "@/auth/firebase";
import { useLoadingCallback } from "react-loading-hook";
import { clientConfig } from "@/config/client-config";
import { Button } from "@/components/ui/button";
import { LoadingIcon } from "@/ui/icons";
import { useRouter } from "next/navigation";
import { incrementCounter } from "@/actions/user-counters";
import { signOut, reload } from "firebase/auth";
import { ButtonGroup } from "@/ui/ButtonGroup";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserProfileProps {
  count: number;
}

export function UserProfile({ count }: UserProfileProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { getFirebaseAuth } = useFirebaseAuth();
  const [hasLoggedOut, setHasLoggedOut] = React.useState(false);
  const [handleLogout, isLogoutLoading] = useLoadingCallback(async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    setHasLoggedOut(true);
    await fetch("/api/logout", {
      method: "GET",
    });
    window.location.reload();
  });

  const [handleClaims, isClaimsLoading] = useLoadingCallback(async () => {
    const auth = getFirebaseAuth();
    await fetch("/api/custom-claims", {
      method: "POST",
    });

    await auth.currentUser!.getIdTokenResult(true);
  });

  const [handleIncrementCounterApi, isIncrementCounterApiLoading] =
    useLoadingCallback(async () => {
      const response = await fetch("/api/user-counters", {
        method: "POST",
      });

      await response.json();
      router.refresh();
    });

  function handleRedirect() {
    router.push(
      `${clientConfig.redirectUrl}?redirect_url=${window.location.href}`
    );
  }

  let [isIncrementCounterActionPending, startTransition] =
    React.useTransition();

  if (!user && hasLoggedOut) {
    return (
      <div>
        <div>
          <h3>
            <span>You are being logged out...</span>
            <LoadingIcon />
          </h3>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Card>
        <h3>You are logged in as</h3>
        <div>
          <div>{user.photoURL && <img src={user.photoURL} />}</div>
          <span>{user.email}</span>
        </div>

        {!user.emailVerified && (
          <div>
            <Badge>Email not verified.</Badge>
          </div>
        )}
        <Button
          variant="outline"
          disabled={isClaimsLoading}
          onClick={handleClaims}
        >
          Refresh custom user claims
        </Button>
        <ButtonGroup>
          <div>
            <h5>Custom claims</h5>
            <pre>{JSON.stringify(user.customClaims, undefined, 2)}</pre>
          </div>

          <Button
            loading={isLogoutLoading}
            disabled={isLogoutLoading}
            onClick={handleLogout}
          >
            Log out
          </Button>
          <Button onClick={handleRedirect}>Redirect</Button>
        </ButtonGroup>
      </Card>
      <Card>
        <h3>
          {/* defaultCount is updated by server */}
          Counter: {count}
        </h3>
        <ButtonGroup>
          <Button
            loading={isIncrementCounterApiLoading}
            disabled={
              isIncrementCounterApiLoading || isIncrementCounterActionPending
            }
            onClick={handleIncrementCounterApi}
          >
            Update counter w/ api endpoint
          </Button>
          <Button
            loading={isIncrementCounterActionPending}
            disabled={
              isIncrementCounterActionPending || isIncrementCounterApiLoading
            }
            onClick={() =>
              startTransition(() => incrementCounter() as unknown as void)
            }
          >
            Update counter w/ server action
          </Button>
        </ButtonGroup>
      </Card>
    </div>
  );
}
