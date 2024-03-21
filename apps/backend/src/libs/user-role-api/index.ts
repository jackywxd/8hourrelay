import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import { routesConfig } from "./users/routes-config";
import { functions } from "../../fcm";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));

routesConfig(app);

export { app };
