import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email, subject, reactTemplate) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'EduFlow<onboarding@resend.dev>',
      to: [email],
      subject: subject,
      react: reactTemplate,
    });

    if (error) {
      return error;
    }

    return data;
  } catch (error) {
    return error;
  }
};
