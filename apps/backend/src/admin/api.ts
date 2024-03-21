import { functions } from "../fcm";
import { app } from "../libs/user-role-api";

export const api = functions.https.onRequest(app);
