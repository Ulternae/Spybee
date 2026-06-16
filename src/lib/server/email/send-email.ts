import { resend } from "./providers/resend";

type SendEmailParams = {
  from: string;
  to: string | string[];
  subject: string;
  react: React.ReactNode;
  headers?: Record<string, string>;
};

export async function sendEmail(params: SendEmailParams) {
  try {
    return await resend.emails.send({
      ...params,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
