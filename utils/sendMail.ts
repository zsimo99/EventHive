import nodemailer from "nodemailer";

interface SendMailOptions {
  token: string;
  email: string;
  name: string;
  company?: string;
  support_email?: string;
}

export const sendMail = async ({
  token,
  email,
  name,
  company = "EventHive",
  support_email = "support@eventhive.com",
}: SendMailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mohamedzoraa100@gmail.com", // your Gmail
      pass: "hxnk jisx sjdn aufm",       // App Password
    },
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
  const currentYear = new Date().getFullYear();

  const htmlContent = `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Verify your email</title>
    <style>
      body { margin:0; padding:0; background:#f4f6f8; font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
      .container { width:100%; max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; }
      .header { padding:20px; text-align:center; background:#0f172a; color:#fff; font-weight:700; font-size:20px; }
      .content { padding:28px 24px; color:#111827; font-size:16px; line-height:1.45; }
      .button { display:inline-block; text-decoration:none; padding:12px 22px; border-radius:8px; background:#2563eb; color:#fff; font-weight:600; }
      .footer { padding:18px 24px; font-size:13px; color:#9ca3af; text-align:center; background:#fafafa; }
    </style>
  </head>
  <body>
    <table role="presentation" width="100%" style="background:#f4f6f8; padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" class="container" width="100%">
            <tr>
              <td class="header">${company}</td>
            </tr>
            <tr>
              <td class="content">
                <p>Hello ${name},</p>
                <p>Thanks for creating an account. Please verify your email to activate your account.</p>
                <p style="text-align:center; margin:20px 0;">
                  <a class="button" href="${verifyUrl}" target="_blank">Verify my email</a>
                </p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
                <p>If you didn't request this, ignore this email or contact <a href="mailto:${support_email}">${support_email}</a>.</p>
              </td>
            </tr>
            <tr>
              <td class="footer">
                © ${currentYear} ${company}. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"${company}" <mohamedzoraa100@gmail.com>`,
    to: email,
    subject: "Verify your email",
    text: `Hello ${name}, verify your email: ${verifyUrl}`,
    html: htmlContent,
  });

  console.log("Verification email sent to", email);
};
