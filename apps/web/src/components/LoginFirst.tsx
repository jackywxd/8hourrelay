import Link from "next/link";
import { Button } from "./ui/button";

export default function LoginFirst() {
  return (
    <div className="flex flex-col flex-w w-full items-center gap-12 pt-10">
      <h2 className="card-title">Login required</h2>
      <p>Please use your email to login. Click Login to login page</p>
      <Link className="link link-primary" href="/login">
        <Button>Login Now</Button>
      </Link>
    </div>
  );
}
