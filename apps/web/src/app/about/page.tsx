"use client";
import About from "../../content/about.mdx";
import Images from "./Images";
export default function Page() {
  return (
    <div className="prose">
      <About />
      <Images />
    </div>
  );
}
