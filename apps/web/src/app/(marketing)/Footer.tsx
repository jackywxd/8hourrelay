import { Icons } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function Footer({
  className,
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="copyright">
          <span>© 8-Hour Relay 2023</span>
        </div>
        <div className="flex items-center">
          <Icons.heart className="w-8 text-red-600" />
          <span className="text mr-2">by</span>
          <Link href="https://heidi.cloud">
            <span className="font-semibold text-white">Heidi Technology</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
