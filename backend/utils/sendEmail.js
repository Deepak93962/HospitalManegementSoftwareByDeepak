const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Configure default Gmail SMTP 
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || 'your-email@gmail.com',
        pass: process.env.SMTP_PASSWORD || 'your-app-password',
      },
    });

    const mailOptions = {
      from: `Clinify HMS <${process.env.SMTP_EMAIL || 'no-reply@clinify.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Email sent successfully to ${options.email} - ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[SMTP ERROR] Email sending failed:", error.message);
    return false;
  }
};

module.exports = sendEmail;
