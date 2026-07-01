const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { handleMessage } = require('./conversation');
const db = require('./db');
const { sendMessage, sendMediaMessage } = require('./twilio-client');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/webhook', async (req, res) => {
    const from = req.body.From ? req.body.From.replace('whatsapp:', '') : 'test-user';
    const body = req.body.Body;

    if (!body) {
        return res.sendStatus(400);
    }

    const { state, data } = db.getState(from);
    const result = handleMessage(body, state, data);

    db.saveState(from, result.newState, result.bookingData || data);

    if (result.bookingData && result.bookingData.status) {
        if (result.newState === 'awaiting_payment' && state !== 'awaiting_payment') {
            db.saveBooking(from, result.bookingData.details, result.bookingData.slot, 'pending_payment');
        } else if (result.bookingData.status === 'confirmed') {
            db.updateBookingStatus(from, 'confirmed');
        }
    }

    if (result.mediaUrl) {
        await sendMediaMessage(from, result.text, result.mediaUrl);
    } else {
        await sendMessage(from, result.text);
    }

    res.status(200).send('EVENT_RECEIVED');
});

app.get('/bookings', (req, res) => {
    const bookings = db.getAllBookings();
    res.json(bookings);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});