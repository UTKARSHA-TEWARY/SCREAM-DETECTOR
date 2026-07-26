const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL_USER,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});
//It connects to an email server using the SMTP (Simple Mail Transfer Protocol) protocol, authenticates, and asks that server to send the email
async function sendAlertEmail(toEmails, userName, alertLevel) {
  if (!toEmails || !toEmails.length) {
    console.warn("⚠️ No recipients defined, skipping email.");
    return;
  }
//If your app or server is hacked, your actual Gmail password is exposed.
//An attacker could log into your Gmail account directly, read emails, change settings, or reset passwords.

// this is  for safety, you should use an App Password instead of your actual Gmail password. An App Password is a 16-character code that gives a less secure app or device permission to access your Google Account. It can be revoked at any time without affecting your main account password, providing an extra layer of security.
  const mailOptions = {
    from: `"Guardian AI" <${process.env.ALERT_EMAIL_USER}>`,
    to: toEmails.join(","),
    subject: `🚨 Alert: ${alertLevel}`,
    text: `${userName}, alert level detected is ${alertLevel}. Please take necessary action.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Alert email sent to:", toEmails.join(", "));
  } catch (err) {
    console.error("❌ Failed to send alert email:", err.message);
  }
}

module.exports = sendAlertEmail;
//transporter is the object created by Nodemailer that knows how to connect to an email server (SMTP) and send email