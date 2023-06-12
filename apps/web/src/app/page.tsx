import { Suspense } from "react";
import Link from "next/link";

import About from "../content/about.mdx";
import Register from "../content/register.mdx";
import TimeCard from "@/components/TimeCard";
import MessageForm from "./message";

export default function Web() {
  return (
    <div className="flex flex-col w-full">
      <div className="relative p-2">
        <div
          className="absolute inset-0 bg-center bg-cover blur-sm opacity-20"
          style={{
            backgroundImage: `url("/assets/background.jpg")`,
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full pt-3">
          <div className="basis-1/5 text-4xl md:text-5xl lg:text-6xl font-extrabold ">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7300] to-[#783100]">
              Sep 10, 2023
            </span>
          </div>
          <div className="basis-1/5 text-1xl md:text-2xl lg:text-3xl pt-10">
            <span className="bg-clip-text text-[#FF7300]">
              Features race for everyone. Together we are stronger. Join us in
              Sep!
            </span>
          </div>
          <div className="flex grow">
            <TimeCard />
          </div>
          <Link href="/register">
            <button className="btn btn-primary btn-md m-10">
              Register Now
            </button>
          </Link>
        </div>
      </div>

      <div className="divider"></div>
      <div className="flex flex-col justify-center items-center text-left">
        <div className="text-3xl font-semibold py-10 px-3">Register Now</div>
        <div className="">
          <Register />
        </div>
        <Link href="/register">
          <button className="btn btn-primary btn-md m-10">Register Now</button>
        </Link>
      </div>
      <div className="divider"></div>
      <div className="flex flex-col justify-center items-center text-left py-10 px-2">
        <div className="text-3xl font-semibold py-10 px-3">Our Mission</div>
        <div className="w-full md:w-[800px]">
          <About />
        </div>
      </div>
      <div className="flex flex-col md:w-[800px] self-center items-center text-left py-10 px-2">
        <div className="divider"></div>
        <div className="text-3xl font-semibold py-10 px-3">Keep in touch</div>
        <Suspense>
          <MessageForm />
        </Suspense>
      </div>
    </div>
  );
}
