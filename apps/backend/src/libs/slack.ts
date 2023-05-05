import { IncomingWebhook } from "@slack/webhook";
import * as functions from "firebase-functions";

// hi-vpn webhook
const url =
  "https://hooks.slack.com/services/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";

// hi-text webhook
// https://hooks.slack.com/services/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
const webhook = new IncomingWebhook(url!);

const ENV = functions.config().env?.ENV
  ? functions.config().env.ENV
  : "STAGING";
// Send the notification
export const slackSendMsg = async (text: string): Promise<void> => {
  await webhook.send({
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: `[${ENV}] ${text}` } },
    ],
  });
};

// Send the notification
export const slackSendText = async (text: string) => {
  return webhook.send(`[${ENV}] ${text}`);
};
