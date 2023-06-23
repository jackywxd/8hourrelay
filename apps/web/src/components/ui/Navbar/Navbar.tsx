import Link from "next/link";

import AccountButton from "./AccountButton";

const navigation = [
  { name: "The Event", href: "/#root" },
  { name: "Mission", href: "/#ourMission" },
  { name: "RULES", href: "/#rules" },
  { name: "Volunteering", href: "/#volunteering" },
  { name: "Sponsorship", href: "/#sponsorship" },
  { name: "teams", href: "/teams" },
];

const Navbar = () => {
  return (
    <header className="fixed">
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
            <li key={item.name} className="nav-link">
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
          <AccountButton />
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
