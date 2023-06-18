import { Suspense } from "react";
import Link from "next/link";

import TimeCard from "@/components/TimeCard";
import Loader from "@/components/Loader";

export default function HeroSection() {
  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `url("/img/hero.jpg")`,
        height: `clamp(48em, 42vmin + 105px, 960px)`,
      }}
    >
      <div className="hero-text content-container small">
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
