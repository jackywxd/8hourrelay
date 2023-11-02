"use server";

const HOST_URL = process.env.NEXT_PUBLIC_HOST_NAME || "http://localhost:3000";
export async function getRaceEntries() {
  const res = await fetch(`${HOST_URL}/get-race-entries`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  console.log(`res.ok: ${res.ok}`, res);
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const entries = res.json();

  return entries;
}
