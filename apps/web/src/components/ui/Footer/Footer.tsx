import Link from "next/link";

import GitHub from "@/components/icons/GitHub";

import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className="lg:mx-auto max-w-[1920px] px-6 bg-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b py-12 text-white transition-colors duration-150">
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white hover:text-zinc-200 transition ease-in-out duration-150"
              >
                Home
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white hover:text-zinc-200 transition ease-in-out duration-150"
              >
                Event
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white hover:text-zinc-200 transition ease-in-out duration-150"
              >
                Sponsors
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white hover:text-zinc-200 transition ease-in-out duration-150"
              >
                Volunteers
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="text-white font-bold hover:text-zinc-200 transition ease-in-out duration-150">
                Event
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white hover:text-zinc-200 transition ease-in-out duration-150"
              >
                Race Guide
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white hover:text-zinc-200 transition ease-in-out duration-150"
              >
                Race Rules
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white hover:text-zinc-200 transition ease-in-out duration-150"
              >
                Race Results
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-6 flex items-start lg:justify-end text-white">
          <div className="flex space-x-6 items-center h-10">
            <a
              aria-label="Github Repository"
              href="https://github.com/vercel/nextjs-subscription-payments"
            >
              <GitHub />
            </a>
          </div>
        </div>
      </div>
      <div className="py-12 flex flex-col md:flex-row justify-between items-center space-y-4">
        <div>
          <span>&copy; 2023 ACME</span>
        </div>
        <div className="flex items-center">
          <span className="text-white">Crafted by</span>
          <a href="https://heidi.cloud" aria-label="heidi.cloud Link">
            <span>{` Heidi Technology`}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
