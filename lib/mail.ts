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
  // Send the email. Include a `from` so mail clients show a valid sender and
  // the email transport doesn't try to rewrite or drop parts of the message.
  const fromAddress =
    process.env.EMAIL_FROM ?? process.env.EMAIL_USER ?? "no-reply@example.com";
  const response = await transporter.sendMail({
    from: fromAddress,
    to: toEmail,
    subject: subject,
    text: content,
    html: content,
  });

  // Check if email was accepted
  if (response.accepted.length === 0) {
    throw new Error("Failed to send email", { cause: response });
  }
  console.log("Email successfully sent: ", response);
}
