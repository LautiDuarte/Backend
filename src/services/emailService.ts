import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true para SSL/TLS (puerto 465), false para STARTTLS (puerto 587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: `'LoyalGaming E-Sports' <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Email enviado a ${to}`);
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw new Error('No se pudo enviar el correo');
  }
}