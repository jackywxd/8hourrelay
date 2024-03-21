import { redirect } from "next/navigation";
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";

import { authConfig } from "@/config/server-config";
import { mapTokensToUser } from "@/auth/server-auth-provider";
import { Header } from "@/components/header";

export default async function Example({
  children,
}: {
  children: React.ReactNode;
}) {
  const tokens = await getTokens(cookies(), authConfig);
  const user = tokens ? mapTokensToUser(tokens) : null;
  console.log("user", user);

  if (!user) {
    redirect("/login");
  }
  return (
    <>
      <div className="min-h-full">
        <Header user={user} />
        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-zinc-700 px-5 py-6 shadow sm:px-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
