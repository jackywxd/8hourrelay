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
      <div className="flex min-h-screen flex-col items-center bg-[#1e1f29]">
        <h1>Vancouver 8 Hour Relay 2022</h1>
        <TimeCard />
        <div>
          <Button onClick={onClick} text="Sign up" />
        </div>
      </div>
      <div className="flex min-h-screen flex-col items-center bg-[#6666]">
        <h1>Context</h1>
      </div>
    </div>
  );
}
