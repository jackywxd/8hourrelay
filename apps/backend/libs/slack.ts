import { IncomingWebhook } from "@slack/webhook";

// const url =
//   'https://hooks.slack.com/services/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';

const url =
  process.env.SLACK ??
  "https://hooks.slack.com/services/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";
const ENV = process.env.ENV ?? "dev";

const webhook = new IncomingWebhook(url);

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
