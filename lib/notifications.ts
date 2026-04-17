import { Resend } from "resend";
import twilio from "twilio";
import { prisma } from "@/lib/prisma";

export async function getNotificationSettings() {
  const settingsList = await prisma.siteSettings.findMany();
  return settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
}

function parseTemplate(template: string, data: Record<string, string>) {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return result;
}

export async function sendNotification({
  toEmail,
  toPhone,
  subject,
  event,
  data
}: {
  toEmail?: string;
  toPhone?: string;
  subject: string;
  event: 'JOB_CREATED' | 'STATUS_UPDATE' | 'AI_COMPLETED';
  data: Record<string, string>;
}) {
  const settings = await getNotificationSettings();

  // 1. Prepare Content from Templates
  const emailTemplateKey = `${event}_EMAIL_TEMPLATE`;
  const whatsappTemplateKey = `${event}_WHATSAPP_TEMPLATE`;

  const emailBody = parseTemplate(settings[emailTemplateKey] || getDefaultTemplate(event, 'EMAIL'), data);
  const whatsappBody = parseTemplate(settings[whatsappTemplateKey] || getDefaultTemplate(event, 'WHATSAPP'), data);

  // 2. Send Email via Resend
  if (toEmail && settings.resendApiKey) {
    try {
      const resend = new Resend(settings.resendApiKey);
      await resend.emails.send({
        from: settings.emailFromAddress || "onboarding@resend.dev",
        to: toEmail,
        subject: subject,
        html: emailBody.replace(/\n/g, "<br>"),
      });
      console.log(`Email sent to ${toEmail} for event ${event}`);
    } catch (error) {
      console.error("Resend Email Error:", error);
    }
  }

  // 3. Send WhatsApp via Twilio
  if (toPhone && settings.twilioSid && settings.twilioToken && settings.twilioFromNumber) {
    try {
      const client = twilio(settings.twilioSid, settings.twilioToken);
      await client.messages.create({
        body: whatsappBody,
        from: `whatsapp:${settings.twilioFromNumber}`,
        to: `whatsapp:${toPhone.startsWith('+') ? toPhone : '+' + toPhone}`,
      });
      console.log(`WhatsApp sent to ${toPhone} for event ${event}`);
    } catch (error) {
      console.error("Twilio WhatsApp Error:", error);
    }
  }

  // 4. Admin Alert (Email only)
  if (settings.adminNotificationEmail && event === 'JOB_CREATED') {
    try {
      const resend = new Resend(settings.resendApiKey);
      await resend.emails.send({
        from: settings.emailFromAddress || "onboarding@resend.dev",
        to: settings.adminNotificationEmail,
        subject: `[ADMIN ALERT] New Job: ${data.job_title}`,
        text: `A new job has been submitted.\n\nID: ${data.job_id}\nClient: ${data.customer_name}\nService: ${data.service_name}`,
      });
    } catch (err) {
      console.error("Admin Email Alert Error:", err);
    }
  }
}

function getDefaultTemplate(event: string, type: 'EMAIL' | 'WHATSAPP'): string {
  if (event === 'JOB_CREATED') {
    return type === 'EMAIL' 
      ? "Hello {{customer_name}},\n\nYour job '{{job_title}}' has been successfully submitted. Your Job ID is {{job_id}}.\n\nWe will notify you once processing begins."
      : "Hi {{customer_name}}! Your job '{{job_title}}' was received. ID: {{job_id}}. We'll keep you updated.";
  }
  if (event === 'STATUS_UPDATE') {
    return "The status of your job '{{job_title}}' has been updated to: {{status}}.";
  }
  if (event === 'AI_COMPLETED') {
    return "Great news! Our AI agent has finished processing your job '{{job_title}}'. You can view the results in your dashboard.";
  }
  return "Update regarding your job {{job_id}}.";
}
