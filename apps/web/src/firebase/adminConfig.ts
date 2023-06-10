import admin from "firebase-admin";

const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
console.log(`key is `, key);
const serviceAccount = Buffer.from(key!, "base64").toString();
console.log(serviceAccount);
if (admin.apps.length === 0)
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
  });

const firebaseDb = admin.firestore();

export { firebaseDb };
