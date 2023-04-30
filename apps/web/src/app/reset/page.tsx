"use client";
import { useRouter } from "next/navigation";
import Register from "../../content/register.mdx";
import { Button } from "ui";
export default function Page() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center">
      <div className="prose mx-2">
        <Register />
      </div>
      <div className="flex flex-col items-center m-20">
        <Button
          onClick={() => {
            router.push("/login");
          }}
          text="Register Now"
        />
      </div>
    </div>
  );
}
