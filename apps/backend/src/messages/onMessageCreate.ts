import { Message } from "@8hourrelay/models";
import { functions, logger } from "../fcm";
import Mail from "nodemailer/lib/mailer";
import { sendMail } from "../libs/sendMail";
import { slackSendText } from "../libs/slack";

const EMAILS = ["8hourrelay@gmail.com", "jackywxd@gmail.com"];

export const onMessageCreate = functions.firestore
  .document("Race/{year}/Messages/{mid}")
  .onCreate(async (snapshot, _) => {
    const message = snapshot.data() as Message;

    logger.debug("New message created", { message });

    try {
      const text = `Name: ${message.name}\nEmail: ${message.email}\n\nContent of the message: \n\n${message.messages}`;
      const email: Mail.Options = {
        text,
        from: process.env.FROM_EMAIL,
        to: EMAILS,
        subject: `New message from ${message.name} ${message.email}`, //TODO: come out better email subject
      };

      await Promise.all([
        sendMail(email),
        slackSendText(text),
        snapshot.ref.set(
          {
            forwarded: true,
            forwardedTo: EMAILS,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ),
      ]);
    } catch (err) {
      logger.error(`Failed to handle new message`, { err });
    }
  });
