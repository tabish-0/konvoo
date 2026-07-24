export async function sendResetPasswordEmail(email, token) {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "Konvoo", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email }],
      subject: "Your Konvoo password reset request",
      htmlContent: `
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
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Brevo API error: ${res.status}`);
  }
}