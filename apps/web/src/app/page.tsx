"use client";
import { useRouter } from "next/navigation";
import { Button } from "ui";
import { useCallback } from "react";

import TimeCard from "../components/TimeCard";
import styles from "@/styles/index.module.css";

export default function Web() {
  const router = useRouter();

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
          <div className="text-5xl font-extrabold ">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-blue-900">
              8 Hour Relay 2023
            </span>
          </div>
          <TimeCard />
          <div>
            <Button onClick={onClick} text="Sign up" />
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-col items-center bg-[#6666]">
        <h1>Context</h1>
      </div>
    </div>
  );
}
