# Tattoo Studio WhatsApp Booking Bot

A deterministic Node.js WhatsApp bot for handling tattoo studio bookings.

## Features
- Step-by-step booking flow (Welcome -> Details -> Slot Selection -> Payment -> Confirmation).
- Persistent state management using SQLite.
- Strict intent matching for payment confirmation.
- Admin endpoint to view all bookings.

## Tech Stack
- Node.js + Express
- Twilio WhatsApp API
- SQLite (better-sqlite3)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`.
   - Fill in your Twilio Account SID, Auth Token, and WhatsApp Sandbox number.

3. **Twilio Sandbox Setup:**
   - Go to the Twilio Console -> Messaging -> Try it Out -> Send a WhatsApp Message.
   - Follow instructions to join the sandbox.
   - Set the Webhook URL (POST) to your server URL (e.g., `https://your-ngrok-url.com/webhook`).

4. **Run Locally:**
   ```bash
   npm start
   ```
   Use `ngrok http 3000` to expose your local port for testing.

5. **Deployment:**
   Deploy to Render, Railway, or any Node.js host. Ensure you set the environment variables.

## Endpoints
- `POST /webhook`: The endpoint for Twilio messages.
- `GET /bookings`: Returns a JSON list of all bookings in the system.

## Configuration
Edit `conversation.js` to update:
- FAQ content
- Available slots
- Deposit amount and QR code URL
- Google Form link