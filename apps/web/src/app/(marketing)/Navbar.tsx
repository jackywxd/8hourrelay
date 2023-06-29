import { cn } from "@/lib/utils";
import Link from "next/link";

const navigation = [
  { name: "The Event", href: "/#root" },
  { name: "Mission", href: "/#ourMission" },
  { name: "RULES", href: "/#rules" },
  { name: "Volunteering", href: "/#volunteering" },
  { name: "Sponsorship", href: "/#sponsorship" },
  { name: "teams", href: "/teams" },
];

const Navbar = ({ changeBg }: { changeBg: boolean }) => {
  return (
    <header
      className={cn(
        "fixed",
        changeBg &&
          "opacity-90 bg-[color:var(--bg-dark)] shadow-gray-700 lg:shadow-lg transition-all duration-300"
      )}
    >
      <div className="logo">
        <a href="/">
          <span className="sr-only">8 Hour Relay</span>
          <img src="/img/logo_white.svg" />
        </a>
      </div>
      <nav className="mobile-menu">
        <label htmlFor="show-menu" className="show-menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </label>
        <input type="checkbox" id="show-menu" />
        <ul id="menu">
          {navigation.map((item) => (
            <li
              key={item.name}
              className="nav-link hover:underline hover:underline-offset-4"
            >
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
          <li className="nav-link signin hover:underline hover:underline-offset-4">
            <a href="/login" className={changeBg ? "text-white" : undefined}>
              Sign In/Account
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
