import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { mapTokensToUser } from "@/auth/server-auth-provider";
import { UserNav } from "@/components/user-nav";

import { ServerAuthProvider } from "@/auth/server-auth-provider";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tokens = await getTokens(cookies(), authConfig);
  const user = tokens ? mapTokensToUser(tokens) : null;
  if (!user) {
    return null;
  }

  return (
    /* @ts-expect-error https://github.com/vercel/next.js/issues/43537 */
    <ServerAuthProvider>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back! {user?.email}
            </h2>
            <p className="text-muted-foreground"></p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav user={user} />
          </div>
        </div>
        {children}
      </div>
    </ServerAuthProvider>
  );
}
