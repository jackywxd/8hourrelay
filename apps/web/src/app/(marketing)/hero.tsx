"use client";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import TimeCard from "@/components/TimeCard";
import Loader from "@/components/Loader";
import { useInView } from "react-intersection-observer";

export default function HeroSection() {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });
  useEffect(() => console.log(inView, entry));
  return (
    <div className="hero-section relative" ref={ref}>
      <Image
        className="object-cover w-full h-full"
        src="/img/hero.jpg"
        alt="Hero image"
        fill
        quality={70}
      />
      <div className="hero-text content-container small relative z-10">
        <h1
          style={{
            fontSize: `clamp(3.5rem, calc(10vw + 0.5rem), 6.0rem)`,
          }}
        >
          Sept 10 2023
        </h1>
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
  );
}
