import Link from "next/link";

export async function generateStaticParams() {
  return [{}];
}

export default function Home() {
  return <div>Admin Page</div>;
}
