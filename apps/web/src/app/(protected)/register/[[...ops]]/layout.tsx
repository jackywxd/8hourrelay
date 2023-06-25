import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Link } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "8 Hour Relay/Register",
  description: "Vancouver 8 hour relay offical website",
};

function RegisterLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex px-2 h-screen w-full flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      {children}
    </div>
  );
}

export default RegisterLayout;
