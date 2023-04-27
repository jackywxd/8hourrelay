// Initializes the `mailer` service on path `/mailer`
import { logger } from "firebase-functions";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

/*
  email = {
            from: FROM_EMAIL,
            to: user.email,
            subject: 'Verification Code',
            html: tokenLink,
          };
*/
export const sendMail = async (email: Mail.Options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    secure: true, // true for 465, false for other ports
    auth: {
      user: SMTP_USER, // generated ethereal user
      pass: SMTP_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail(email);

  logger.debug("Email sent", info);
};
