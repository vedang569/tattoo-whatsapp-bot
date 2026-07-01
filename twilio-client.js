const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendMessage(to, body) {
    try {
        await client.messages.create({
            body: body,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
        });
        console.log(`Message sent to ${to}`);
    } catch (error) {
        console.error(`Error sending message to ${to}:`, error);
    }
}

async function sendMediaMessage(to, body, mediaUrl) {
    try {
        await client.messages.create({
            body: body,
            mediaUrl: [mediaUrl],
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
        });
        console.log(`Media message sent to ${to}`);
    } catch (error) {
        console.error(`Error sending media message to ${to}:`, error);
    }
}

module.exports = { sendMessage, sendMediaMessage };