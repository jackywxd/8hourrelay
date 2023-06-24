"use client";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import TimeCard from "@/components/TimeCard";
import Loader from "@/components/Loader";
import { useInView } from "react-intersection-observer";
import Navbar from "./Navbar";

export default function HeroSection() {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0.3,
  });
  useEffect(() => {
    console.log(`inView`, { inView });
  });
  return (
    <>
      <div className="w-full">
        <Navbar changeBg={!inView} />
      </div>
      <div className="hero-section relative" ref={ref}>
        <Image
          className="object-cover w-full h-full"
          src="/img/hero.jpg"
          alt="Hero image"
          fill
          quality={70}
        />
        <div className="hero-text content-container small relative z-10">
          <h1>Sept 10 2023</h1>
          <div className="countdown">count down to the event</div>
          <Suspense fallback={Loader}>
            <TimeCard />
          </Suspense>

          <Link href="/register">
            <button
              className="btn btn-primary btn-large btn-register"
              type="submit"
            >
              Register Now
            </button>
          </Link>
        </div>
      </div>
      {!inView && (
        <div className="nav-link top transition-opacity duration-900 ">
          <Link href="#root">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 hover:animate-bounce hover:delay-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
              />
            </svg>
          </Link>
        </div>
      )}
    </>
  );
}
