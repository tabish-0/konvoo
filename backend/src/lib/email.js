import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

transporter.verify((err) => {
  if (err) console.error("SMTP connection error:", err.message);
  else console.log("SMTP server ready to send emails");
});

export async function sendResetPasswordEmail(email, token) {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await transporter.sendMail({
    from: `"Konvoo Support" <${process.env.SMTP_USER}>`,
    to: email,
    replyTo: process.env.SMTP_USER,
    subject: "Your Konvoo password reset request",
    text: `Hi,\n\nWe received a request to reset your Konvoo password. Open this link within the next hour to set a new one:\n\n${url}\n\nIf you didn't request this, you can safely ignore this email.\n\n— The Konvoo Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2937;">
        <h2 style="color: #4f46e5;">Reset your Konvoo password</h2>
        <p>We received a request to reset your password. This link is valid for 1 hour.</p>
        <p style="margin: 24px 0;">
          <a href="${url}" style="background: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color: #6b7280; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}