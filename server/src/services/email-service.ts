import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // Should be change later
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export function renderTemplate(
  templateName: string,
  data: Record<string, any>,
): string {
  const templatePath = path.join(__dirname, '../templates', templateName);
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);
  return template(data);
}

export async function sendCodeEmail(
  to: string,
  nickname: string,
  code: string,
) {
  const html = renderTemplate('code-email.html', { nickname, code });

  return sendEmail({ to, subject: 'Welcome to Hot Takes!', html });
}
