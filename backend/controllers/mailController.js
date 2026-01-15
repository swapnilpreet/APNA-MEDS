import transporter from "../config/mailer.js";

export const sendMail = async (req, res) => {
  const { to, subject, html, text } = req.body;
 
  if (!to || !subject || (!html && !text)) {
    return res.status(400).json({
      success: false,
      message: "to, subject and html/text are required",
    });
  }

  try {
    const info = await transporter.sendMail({
      from: `"APNA MEDS" <${process.env.GOOGLE_APP_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    res.send({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email Error:", error);
    res.send({
      success: false,
      message: "Email failed to send",
    });
  }
};
