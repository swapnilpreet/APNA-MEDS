// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {

  console.log(to, subject, html)
   console.log(process.env.GOOGLE_APP_EMAIL, process.env.GOOGLE_APP_PASSWORD)
  try {
    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from:`"Apna-med Pharmacy" <${process.env.GOOGLE_APP_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email error:", error);
  }
};
