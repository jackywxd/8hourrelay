"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import AccountButton from "./AccountButton";
import Loader from "@/components/Loader";

const navigation = [
  { name: "Registration", href: "/registration" },
  { name: "Teams", href: "/teams" },
  { name: "Event", href: "/event" },
  { name: "Sponsors", href: "/sponsors" },
  { name: "Volunteers", href: "/volunteers" },
];

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 dark:text-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">8 Hour Relay</span>
            <img
              className="h-9 w-auto"
              src="/assets/8hour-logo.png"
              alt="8 Hour Relay Logo"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900  dark:text-gray-100"
            >
              {item.name}
            </a>
          ))}
        </div>
        <Suspense fallback={Loader}>
          <AccountButton isMobile={mobileMenuOpen} />
        </Suspense>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-gray-900 dark:text-gray-100 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">8 Hour Relay</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <Suspense
                fallback={
                  <div className="lg:flex lg:flex-1 lg:justify-end">
                    <span className="loading loading-ring loading-md"></span>
                  </div>
                }
              >
                <AccountButton isMobile={mobileMenuOpen} />
              </Suspense>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
  return (
    <nav
      className={`w-full bg-gray-800 shadow  ${
        navbar ? "min-h-screen z-10" : ""
      }`}
    >
      <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <a href="/">
              <div className="flex justify-center items-center">
                <img
                  className="w-16 h-16 lg:w-24 lg:h-24"
                  src="/assets/8hour-logo.png"
                  alt="8 Hour Relay Logo"
                />
                <div className="block font-bold">8 Hour Relay</div>
              </div>
            </a>
            <div className="md:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              navbar ? "block" : "hidden"
            }`}
          >
            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              <li className="text-white  p-2 hover:bg-slate-500 rounded">
                <div
                  onClick={() => {
                    setNavbar(false);
                  }}
                >
                  <Link href="/register">Registration</Link>
                </div>
              </li>
              <li className="text-white  p-2 hover:bg-slate-500 rounded">
                <div
                  onClick={() => {
                    setNavbar(false);
                  }}
                >
                  <Link href="/teams">Teams</Link>
                </div>
              </li>
              <li className="text-white p-2 hover:bg-slate-500 rounded">
                <div
                  onClick={() => {
                    setNavbar(false);
                  }}
                >
                  <Link href="/event">Event</Link>
                </div>
              </li>
              <li className="text-white  p-2 hover:bg-slate-500 rounded">
                <div
                  onClick={() => {
                    setNavbar(false);
                  }}
                >
                  <Link href="/sponsors">Sponsors</Link>
                </div>
              </li>
              <li className="text-white  p-2 hover:bg-slate-500 rounded">
                <div
                  onClick={() => {
                    setNavbar(false);
                  }}
                >
                  <Link href="/volunteers">Volunteers</Link>
                </div>
              </li>
              <li className="text-white  p-2 hover:bg-slate-500 rounded">
                <div
                  onClick={() => {
                    setNavbar(false);
                  }}
                >
                  <Link href="/about">About</Link>
                </div>
              </li>
              <li className="text-white  p-2 hover:bg-slate-500 rounded">
                <div
                  onClick={() => {
                    setNavbar(false);
                  }}
                >
                  <Link href="/account">Account</Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
