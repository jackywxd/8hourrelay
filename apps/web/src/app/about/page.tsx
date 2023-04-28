"use client";
import HelloWorld from "./about.mdx";
import { MDXProvider } from "@mdx-js/react";

export default function Page() {
  const components = {
    em: (props) => <i {...props} />,
  };
  return (
    <div className="prose">
      <HelloWorld />
    </div>
  );
}
