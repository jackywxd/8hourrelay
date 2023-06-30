import { Team } from "@8hourrelay/models";
import { functions, logger } from "../fcm";
import Mail from "nodemailer/lib/mailer";
import { sendMail } from "../libs/sendMail";
import { revalidate } from "../libs/revalidate";

const HOST_NAME =
  process.env.ENV === "prod"
    ? "https://8hourrelay.com"
    : "https://staging.8hourrelay.com";

export const onTeamUpdate = functions.firestore
  .document("Race/{year}/Teams/{teamId}")
  .onUpdate(async (snapshot, _) => {
    const before = snapshot.before.data() as Team;
    const after = snapshot.after.data() as Team;

    logger.debug("Team Data Updated", { before, after });
    try {
      if (after.state === "APPROVED" && after.state !== before.state) {
        // we need to send email to user to notify

        const teamLink = encodeURI(`${HOST_NAME}/teams/${after.name}`);
        const content = `Congratulations! Your team ${after.name} has been approved. Now you can share your team by this link: ${teamLink} \n\n 8HourRelay Team`;

        // revalidate page to show the new team
        await Promise.all([
          revalidate("/teams"),
          revalidate(encodeURI(`/teams/${after.name}`)),
          revalidate(encodeURI(`/team/show/${after.name}`)),
        ]);
        const email: Mail.Options = {
          from: process.env.FROM_EMAIL,
          to: after.captainEmail,
          subject: `Team ${after.name} approved!`, //TODO: come out better email subject
          // html: `======<br>${Body}<br><br> Send text to ${To} by replying this email without altering the email subject.`,
          text: content,
        };
        await sendMail(email);
      }
      if (after.isOpen !== before.isOpen) {
        // revalidate page to show the new team
        await Promise.all([
          revalidate("/teams"),
          revalidate(encodeURI(`/teams/${after.name}`)),
          revalidate(encodeURI(`/team/show/${after.name}`)),
        ]);
      }
    } catch (err) {
      logger.error(`Failed to onUpdateTeam`, { err });
    }
  });

export const onTeamDelete = functions.firestore
  .document("Race/{year}/Teams/{teamId}")
  .onDelete(async (snapshot, _) => {
    const deletedTeam = snapshot.data() as Team;

    logger.debug("Team Data deleted", { deletedTeam });
    try {
      // revalidate page to show the new team
      await Promise.all([
        revalidate("/teams"),
        revalidate(encodeURI(`/teams/${deletedTeam.name}`)),
        revalidate(encodeURI(`/team/show/${deletedTeam.name}`)),
      ]);
    } catch (err) {
      logger.error(`Failed to onUpdateTeam`, { err });
    }
  });
