import { ServerAuthProvider } from "@/auth/server-auth-provider";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("login layout");
  /* @ts-expect-error https://github.com/vercel/next.js/issues/43537 */
  return <ServerAuthProvider>{children}</ServerAuthProvider>;
}
