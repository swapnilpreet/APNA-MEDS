// import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.GOOGLE_APP_EMAIL,
//     pass: process.env.GOOGLE_APP_PASSWORD,
//   },
// });

// transporter.verify()
//   .then(() => console.log("SMTP READY ✅"))
//   .catch(err => console.error("SMTP ERROR:", err.message));

// export const sendEmail = async (to, subject, html) => {
//   console.log("sending email")
//   await transporter.sendMail({
//     from: `"Apna-med Pharmacy" <${process.env.GOOGLE_APP_EMAIL}>`,
//     to,
//     subject,
//     html,
//   });
//   console.log("✅ Email sent successfully");
// };

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const response = await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL, // must be verified
      subject,
      html,
    });

    console.log("✅ Email sent via SendGrid");
    return response; // ✅ IMPORTANT
  } catch (error) {
    console.error(
      "❌ SendGrid error:",
      error.response?.body || error.message
    );
    throw error;
  }
};
