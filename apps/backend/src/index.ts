import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

try {
  db.settings({ ignoreUndefinedProperties: true });
} catch (err) {
  console.log(`db init error!`, { err });
}

export * from "./auth";
export * from "./stripe";
export * from "./payment";
