import admin from "firebase-admin";

const serviceAccount = require("./hourrelay-dev-firebase-adminsdk-2pr20-631ee26030.json");
if (admin.apps.length === 0)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

const firebaseDb = admin.firestore();

export { firebaseDb };
