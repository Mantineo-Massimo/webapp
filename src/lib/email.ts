import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const SES_CONFIG = {
    region: process.env.AWS_REGION || "eu-west-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
};

const sesClient = new SESClient(SES_CONFIG);

export async function sendEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
    const params = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: body,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: process.env.EMAIL_FROM || "no-reply@fantapiazza.it",
    };

    try {
        const command = new SendEmailCommand(params);
        const result = await sesClient.send(command);
        return { success: true, result };
    } catch (error) {
        console.error("EMAIL_SEND_ERROR", error);
        return { success: false, error };
    }
}
