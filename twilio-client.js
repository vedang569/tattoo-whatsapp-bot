const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID || 'AC000', process.env.TWILIO_AUTH_TOKEN || '000');

async function sendMessage(to, body) {
    console.log(`[SIMULATED WHATSAPP TO ${to}]: ${body}`);
}

async function sendMediaMessage(to, body, mediaUrl) {
    console.log(`[SIMULATED WHATSAPP TO ${to}] (Media: ${mediaUrl}): ${body}`);
}

module.exports = { sendMessage, sendMediaMessage };