import { IncomingWebhook } from "@slack/webhook";
import { WebClient } from "@slack/web-api";

const url =
  process.env.SLACK_WEBHOOK ??
  "https://hooks.slack.com/services/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";

const ENV = process.env.ENV;

const web = new WebClient(process.env.SLACK_TOKEN);

const webhook = new IncomingWebhook(url!);

export const updateMessage = async (
  channelId: string,
  messageTs: string,
  collectionId: string
) => {
  await web.chat.update({
    channel: channelId,
    ts: messageTs,
    text: `Collection ID: ${collectionId} has been approved!`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Collection ID: ${collectionId} has been approved!`,
        },
      },
    ],
  });

  /*
 // Update the message to remove the approve button
    const updatedBlocks = payload.message.blocks.map((block) => {
      if (block.block_id === 'approval_buttons') {
        return {
          ...block,
          elements: block.elements.filter((element) => element.value !== 'approve_' + collectionId),
        };
      }
      return block;
    });

    await slackWebClient.chat.update({
      channel: payload.channel.id,
      ts: payload.message.ts,
      blocks: updatedBlocks,
    });

  */
};

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

// Send the notification
export const slackActionSend = async (
  text: string,
  id: string, // team ID
  uid: string // user uid
) => {
  return webhook.send({
    text: `[${ENV}] ${text}`,
    attachments: [
      {
        text: "Approve or Deny for the new team?",
        fallback: "You are unable to choose an option",
        callback_id: "approval",
        color: "#3AA3E3",
        actions: [
          {
            name: "approve",
            text: "Approve",
            type: "button",
            value: `approve_${id}_${uid}`,
          },
          {
            name: "deny",
            text: "Deny",
            type: "button",
            value: `deny_${id}_${uid}`,
          },
        ],
      },
    ],
  });
};
