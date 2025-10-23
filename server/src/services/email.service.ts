import nodemailer, { SentMessageInfo } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (
  options: EmailOptions,
): Promise<SentMessageInfo> => {
  try {
    const { to, subject, text, html } = options;
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
};

export const renderTemplate = <T extends Record<string, unknown>>(
  templateName: string,
  data: T,
): string => {
  const templatePath = path.join(__dirname, '../templates', templateName);
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);
  return template(data);
};

export const sendCodeEmail = async (
  to: string,
  nickname: string,
  code: string,
): Promise<SentMessageInfo> => {
  const html = renderTemplate('code-email.html', { nickname, code });

  return sendEmail({ to, subject: 'Welcome to Hot Takes!', html });
};
