"use client";
import { useRouter } from "next/navigation";
import { Button } from "ui";
import { useCallback } from "react";
import About from "../content/about.mdx";
import TimeCard from "../components/TimeCard";
import styles from "@/styles/index.module.css";
import { useTheme } from "react-native-paper";

export default function Web() {
  const router = useRouter();
  const { colors } = useTheme();

  const onClick = useCallback(() => {
    router.push("/login");
  }, []);

  return (
    <div className={styles.container}>
      <div className="relative h-screen">
        <div
          className="absolute inset-0 bg-fixed bg-center bg-cover blur-sm opacity-50"
          style={{
            backgroundImage: `url("/assets/background.jpg")`,
            height: 972,
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <div className="text-5xl md:text-7xl lg:text-8xl font-extrabold ">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7300] to-[#783100]">
              Sep 10, 2023
            </span>
          </div>
          <div className="text-1xl md:text-2xl lg:text-3xl font-semibold pt-10">
            <span className="bg-clip-text text-[#FF7300]">
              Features race for everyone. Together we are stronger. Join use in
              Sep!
            </span>
          </div>
          <TimeCard />
          <div>
            <Button onClick={onClick} text="Sign up" />
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-center text-left py-10 px-2"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-3xl font-semibold">Our Mission</div>
        <div className="prose" style={{ color: colors.onBackground }}>
          <About />
        </div>
      </div>
    </div>
  );
}
