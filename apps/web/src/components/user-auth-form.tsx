"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: string;
}

type FormData = z.infer<typeof userAuthSchema>;

export const UserAuthForm = observer(
  ({ className, mode, ...props }: UserAuthFormProps) => {
    const { store } = useAuth();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(userAuthSchema),
    });
    const searchParams = useSearchParams();

    async function onSubmit(data: FormData) {
      if (typeof window === "object" && mode === "confirm") {
        const fullUrl = window.location.href;
        await store.authStore.signinWithEmailLink(
          fullUrl,
          data.email.toLowerCase()
        );
      } else {
        store.authStore.setEmail(data.email.toLowerCase());
        await store.authStore.sendLoginEmailLink(
          searchParams?.get("from") || "/account"
        );
      }
    }

    return (
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={store.authStore.isLoading}
                {...register("email")}
              />
              {errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              className={cn(buttonVariants())}
              disabled={store.authStore.isLoading}
            >
              {store.authStore.isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mode === "confirm" ? "Confirm your email" : "Sign In with Email"}
            </button>
          </div>
        </form>
        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }))}
          onClick={() => {
            setIsGitHubLoading(true);
            signIn("github");
          }}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </button> */}
      </div>
    );
  }
);
