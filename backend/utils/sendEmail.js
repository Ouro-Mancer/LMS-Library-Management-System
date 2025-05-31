import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE, // FIXED VARIABLE NAME
    port: process.env.SMTP_PORT, // Convert to Number
     
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD, // FIXED VARIABLE NAME
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html: message,
  };

  // await transporter.sendMail(mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully: ", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
