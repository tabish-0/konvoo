import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(email, token) {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const { error } = await resend.emails.send({
    from: "Konvoo <onboarding@resend.dev>", // Resend's default test sender — works immediately, no domain setup needed
    to: email,
    subject: "Your Konvoo password reset request",
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

  if (error) {
    throw new Error(error.message || "Failed to send email via Resend");
  }
}