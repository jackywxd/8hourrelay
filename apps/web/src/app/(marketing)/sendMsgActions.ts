"use server";
import { Message } from "@8hourrelay/models";
import { firebaseDb } from "@/firebase/adminConfig";

export async function sendMessage(data: Message) {
  //   const data = { name, email, messages };
  try {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log(data);
    const year = new Date().getFullYear().toString();
    const now = new Date().toISOString();
    await firebaseDb
      .collection("Race")
      .doc(year)
      .collection("Messages")
      .add({ ...data, createdAt: now, updatedAt: now });
  } catch (err) {
    console.log(`Failed to add message to DB!!`, err);
  }
}
