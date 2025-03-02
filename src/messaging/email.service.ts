import readConfiguration from '../utils/configuration/readConfiguration';
import nodemailer from 'nodemailer';

const configuration = readConfiguration();

async function sendEmail({to, subject, text}: {to: string; subject: string; text: string}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'messanger.kutoa@gmail.com', // Your Gmail
      pass: configuration.emailConfig.appPassword, // App Password (Not your Gmail password)
    },
  });

  // Email options
  const mailOptions = {
    from: 'messanger.kutoa@gmail.com',
    to,
    subject,
    html: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export const emailService = {sendEmail};
