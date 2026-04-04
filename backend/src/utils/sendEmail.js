import nodemailer from 'nodemailer';
import { AppError } from '../middleware/errorHandler.js';

const getEmailConfig = () => {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || user;

  if (!host || !user || !pass) {
    throw new AppError(
      'Email service is not configured. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASS.',
      500
    );
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from,
  };
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to || !subject || (!text && !html)) {
    throw new AppError('Email to, subject and message content are required.', 500);
  }

  const config = getEmailConfig();

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
  } catch (error) {
    throw new AppError(`SMTP verification failed: ${error.message}`, 500);
  }

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    };
  } catch (error) {
    throw new AppError(`Email send failed: ${error.message}`, 500);
  }
};

export default sendEmail;