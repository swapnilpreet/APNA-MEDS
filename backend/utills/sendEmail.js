import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log("EMAIL:", process.env.GOOGLE_APP_EMAIL);
console.log("PASS:", process.env.GOOGLE_APP_PASSWORD );
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP ERROR:", err.message);
  } else {
    console.log("SMTP READY ✅");
  }
});

export const sendEmail = async (to, subject, html) => {
  console.log("EMAIL:", process.env.GOOGLE_APP_EMAIL);
console.log("PASS:", process.env.GOOGLE_APP_PASSWORD );
  console.log("📧 sendEmail called for:", to);

  try {
    await transporter.sendMail({
      from: `Apna-med Pharmacy <${process.env.GOOGLE_APP_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");
    return;
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw error; // IMPORTANT
  }
};
