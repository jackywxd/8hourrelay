"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import About from "../content/about.mdx";
import Register from "../content/register.mdx";
import TimeCard from "@/components/TimeCard";
import { Hero } from "@/components/Hero";
import styles from "@/styles/index.module.css";
import { Button } from "@material-tailwind/react";

export default function Web() {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push("/register");
  }, []);

  console.log(`process.env`, { env: process.env.NEXT_PUBLIC_ENV });
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
          <Button className="!btn-primary btn-lg m-10" onClick={onClick}>
            Register Now
          </Button>
        </div>
      </div>

      <div className="divider"></div>
      <div className="flex flex-col justify-center items-center text-left">
        <div className="text-3xl font-semibold py-10 px-3">Register Now</div>
        <div className="">
          <Register />
        </div>
        <Button className="!btn-primary btn-lg m-10" onClick={onClick}>
          Register Now
        </Button>
      </div>
      <div className="divider"></div>
      <div className="flex flex-col justify-center items-center text-left py-10 px-2">
        <div className="text-3xl font-semibold py-10 px-3">Our Mission</div>
        <div className="w-full md:w-[800px]">
          <About />
        </div>
      </div>
      <div className="divider"></div>
      <div className="flex flex-col w-full md:w-[800px] self-center text-left py-10 px-2">
        <label htmlFor="comment" className="block font-medium leading-6">
          Add your comment
        </label>
        <div className="mt-2 w-full items-center">
          <textarea
            rows={4}
            name="comment"
            id="comment"
            className="block w-full rounded-md border-0 py-1.5  sm:text-sm sm:leading-6"
            defaultValue={""}
          />
        </div>
      </div>
    </div>
  );
}
