import nodemailer from 'nodemailer';
import config from '../config';

export const sendMail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: config.smtp_user,
    to: to,
    subject: 'Reset password within 10 minutes',
    text: '',
    html: `${html}`,
  });
};