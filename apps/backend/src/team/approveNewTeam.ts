import { db, functions, logger } from "../fcm";
import { updateMessage } from "../libs/slack";
const crypto = require("crypto");

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const verifySlackRequest = (req: functions.https.Request) => {
  try {
    // The timestamp and signature from the request's headers
    const requestTimestamp = req.get("x-slack-request-timestamp");
    const requestSignature = req.get("x-slack-signature");

    // Create a basestring for the signature
    const baseString = `v0:${requestTimestamp}:${req.rawBody}`;

    // Create a signature using the Signing Secret
    const mySignature =
      "v0=" +
      crypto
        .createHmac("sha256", slackSigningSecret)
        .update(baseString, "utf8")
        .digest("hex");

    // Compare the signatures
    if (
      crypto.timingSafeEqual(
        Buffer.from(mySignature, "utf8"),
        Buffer.from(requestSignature as string, "utf8")
      )
    ) {
      return true;
      // If they match, handle the request
      // ...
    }
  } catch (err) {
    logger.debug(`Failed to verify slack header!`, { err });
  }
  return false;
};

export const approveTeam = functions.https.onRequest(async (req, res) => {
  logger.debug(`Approve team req`, { req });
  if (!verifySlackRequest(req)) {
    res.status(403).send("Forbidden");
  }
  try {
    const payload = JSON.parse(req.body.payload);

    const action = payload.actions[0];
    const [actionType, collectionId, userId] = action.value.split("_");
    const {
      channel: { id: channelId },
      message_ts: messageTs,
    } = payload;

    let state;

    if (actionType === "approve") {
      logger.debug(`Approved ${collectionId} for ${userId}`);
      state = "APPROVED";
    } else if (actionType === "deny") {
      logger.debug(`Denied ${collectionId} ${userId}`);
      state = "DENIED";
    }

    // Handle approval
    const year = new Date().getFullYear().toString();
    const now = new Date().getTime();
    await Promise.all([
      updateMessage(channelId, messageTs, collectionId),
      db
        .collection("Users")
        .doc(userId)
        .set(
          {
            teamYear: `${year}-${state}-${collectionId}`, // we need to pass the team ID back to user
            updatedAt: now,
          },
          { merge: true }
        ),
      db.collection("Race").doc(year).collection("Teams").doc(collectionId).set(
        {
          state,
          updatedAt: now,
        },
        { merge: true }
      ),
    ]);
  } catch (err) {
    logger.debug(`Failed to process incoming request from Slack`, { err });
  }
  res.status(200).send();
});
