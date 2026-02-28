import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SES_CONFIG = {
    region: process.env.AWS_REGION || "eu-central-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
};

const sesClient = new SESClient(SES_CONFIG);

async function testSES() {
    const from = process.env.EMAIL_FROM || "no-reply@fantapiazza.it";
    console.log(`Testing SES with Source: ${from} in region: ${SES_CONFIG.region}`);

    const params = {
        Destination: { ToAddresses: [from] }, // Send to self
        Message: {
            Body: { Text: { Data: "Test email from FantaPiazza diagnostic script." } },
            Subject: { Data: "SES Test" },
        },
        Source: from,
    };

    try {
        const command = new SendEmailCommand(params);
        const result = await sesClient.send(command);
        console.log("✅ SES Send Success:", result.MessageId);
    } catch (error: any) {
        console.error("❌ SES Send Failure:");
        console.error("Code:", error.name);
        console.error("Message:", error.message);
        if (error.name === 'MessageRejected') {
            console.error("TIP: Ensure your 'From' address is verified in the AWS SES console for this region.");
        }
    }
}

testSES();
