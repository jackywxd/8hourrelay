"use client";
import { useRouter } from "next/navigation";
import { Button } from "ui";
import { useCallback } from "react";
import About from "../content/about.mdx";
import Register from "../content/register.mdx";
import TimeCard from "../components/TimeCard";
import styles from "@/styles/index.module.css";
import { useTheme } from "react-native-paper";

export default function Web() {
  const router = useRouter();
  const { colors } = useTheme();

  const onClick = useCallback(() => {
    router.push("/register");
  }, []);

  console.log(`process.env`, { env: process.env.NEXT_PUBLIC_ENV });
  return (
    <div className={styles.container}>
      <div className="relative h-[675px] ">
        <div
          className="absolute inset-0 bg-fixed bg-center bg-cover blur-sm opacity-20"
          style={{
            backgroundImage: `url("/assets/background.jpg")`,
            height: 675,
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full pt-3">
          <div className="basis-1/5 text-5xl md:text-7xl lg:text-8xl font-extrabold ">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7300] to-[#783100]">
              Sep 10, 2023
            </span>
          </div>
          <div className="basis-1/5 text-1xl md:text-2xl lg:text-3xl font-semibold pt-10">
            <span className="bg-clip-text text-[#FF7300]">
              Features race for everyone. Together we are stronger. Join us in
              Sep!
            </span>
          </div>
          <div className="flex grow">
            <TimeCard />
          </div>
          <div className="basis-1/5 w-[300px] py-5">
            <Button onClick={onClick} text="Register Now" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center text-left py-10 px-2 bg-gray-800">
        <div className="text-3xl font-semibold py-10 px-3">Register Now</div>
        <div className="">
          <Register />
        </div>
        <div className="w-[300px] py-5">
          <Button onClick={onClick} text="Register Now" />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-left py-10 px-2 bg-zinc-900">
        <div className="text-3xl font-semibold py-10 px-3">Our Mission</div>
        <div className={`w-11/12 lg:w-1/2`}>
          <About />
        </div>
      </div>
    </div>
  );
}
