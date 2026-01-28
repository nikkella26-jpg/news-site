"use server";

import nodemailer from "nodemailer";

// Email configuration (common credentials)
const EMAIL_CONFIG = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

// Create the email transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

/**
 * Send an email
 * @param toEmail - Recipient's email address
 * @param subject - Email subject line
 * @param content - Email body (can be HTML or plain text)
 */
export async function sendMail(
  toEmail: string,
  subject: string,
  content: string,
) {
  // Send the email
  const response = await transporter.sendMail({
    to: toEmail, // Recipient's email
    subject: subject, // Email subject
    text: content, // Plain text version
    html: content, // HTML version (can be formatted)
  });

  // Check if email was accepted
  if (response.accepted.length === 0) {
    throw new Error("Failed to send email", { cause: response });
  }
  console.log("Email successfully sent: ", response);
}
