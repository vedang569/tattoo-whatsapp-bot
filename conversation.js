const CONFIG = {
    DEPOSIT_AMOUNT: "₹1000",
    DEPOSIT_QR_URL: "https://example.com/qr-code.png", 
    GOOGLE_FORM_URL: "https://forms.gle/example",
    OPEN_SLOTS: [
        "1. Monday, July 6th - 10:00 AM",
        "2. Monday, July 6th - 2:00 PM",
        "3. Wednesday, July 8th - 11:00 AM",
        "4. Friday, July 10th - 4:00 PM"
    ],
    FAQ_TEXT: `*Tattoo Studio FAQ*\n📍 *Pricing:* Starts at ₹2000. Final price depends on size/detail.\n🧼 *Hygiene:* We use single-use needles and hospital-grade sterilization.\n⏳ *Timeline:* Small tattoos take 1-2 hours; larger pieces may need multiple sessions.\n🔞 *Age:* 18+ only (or 16+ with parental consent).`,
    WELCOME_MESSAGE: `Welcome to the Tattoo Studio! 🎨\nHow can we help you today?\n1) Chat to understand the process (FAQ)\n2) Fill a quick form\n3) Book a slot directly\n\nReply with 1, 2, or 3.`
};

function handleMessage(message, currentState, currentData) {
    const text = message.trim().toLowerCase();

    if (text === 'restart' || text === 'start over') {
        return {
            text: CONFIG.WELCOME_MESSAGE,
            newState: 'initial',
            bookingData: {}
        };
    }

    switch (currentState) {
        case 'initial':
            if (text === '1') {
                return {
                    text: CONFIG.FAQ_TEXT + "\n\nReply 2 to fill the form or 3 to book a slot.",
                    newState: 'initial'
                };
            } else if (text === '2') {
                return {
                    text: `Please fill out this form: ${CONFIG.GOOGLE_FORM_URL}\n\nReply "book" once you are done!`,
                    newState: 'initial'
                };
            } else if (text === '3' || text === 'book') {
                return {
                    text: "Great! Please tell us about your tattoo idea, where on your body you want it, and your preferred date.",
                    newState: 'awaiting_details'
                };
            } else {
                return {
                    text: "Sorry, I didn't catch that. \n\n" + CONFIG.WELCOME_MESSAGE,
                    newState: 'initial'
                };
            }

        case 'awaiting_details':
            if (text.length < 10) {
                return {
                    text: "Please provide a bit more detail about your tattoo idea, body placement, and preferred date (at least 10 characters).",
                    newState: 'awaiting_details'
                };
            }
            return {
                text: "Got it! Here are our available slots:\n\n" + CONFIG.OPEN_SLOTS.join("\n") + "\n\nReply with the number of your choice.",
                newState: 'awaiting_slot',
                bookingData: { ...currentData, details: message }
            };

        case 'awaiting_slot': {
            const slotIndex = parseInt(text) - 1;
            if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= CONFIG.OPEN_SLOTS.length) {
                return {
                    text: "Invalid selection. Please reply with a number from the list:\n\n" + CONFIG.OPEN_SLOTS.join("\n"),
                    newState: 'awaiting_slot'
                };
            }
            const selectedSlot = CONFIG.OPEN_SLOTS[slotIndex];
            return {
                text: `You've selected: ${selectedSlot}\n\nTo confirm, please pay a deposit of ${CONFIG.DEPOSIT_AMOUNT}. \nScan the QR code below and reply "PAID" once done.`,
                mediaUrl: CONFIG.DEPOSIT_QR_URL,
                newState: 'awaiting_payment',
                bookingData: { ...currentData, slot: selectedSlot, status: 'pending_payment' }
            };
        }

        case 'awaiting_payment':
            if (text === 'paid' || text === 'done' || text === 'yes') {
                if (!currentData || !currentData.slot || !currentData.details) {
                    return {
                        text: "I've lost your booking details. Please reply \"restart\" to start over.",
                        newState: 'awaiting_payment'
                    };
                }
                return {
                    text: `✅ *Booking Confirmed!*\n\nSlot: ${currentData.slot}\nDetails: ${currentData.details}\n\n*Arrival Instructions:* Please arrive 15 mins early. Avoid alcohol 24hrs before.\n*Aftercare:* Keep the wrap on for 4 hours, then wash gently with mild soap.`,
                    newState: 'completed',
                    bookingData: { ...currentData, status: 'confirmed' }
                };
            } else if (['no', 'pending', 'not yet', 'not paid'].includes(text)) {
                return {
                    text: `No problem! We'll hold this slot for 24 hours. Please reply "PAID" once the deposit of ${CONFIG.DEPOSIT_AMOUNT} is sent.`,
                    newState: 'awaiting_payment'
                };
            } else {
                return {
                    text: `I'm waiting for the payment confirmation. Please reply "PAID" once you've sent the deposit of ${CONFIG.DEPOSIT_AMOUNT}.`,
                    newState: 'awaiting_payment'
                };
            }

        case 'completed':
            if (['hi', 'hello', 'book', 'restart'].includes(text)) {
                return {
                    text: CONFIG.WELCOME_MESSAGE,
                    newState: 'initial',
                    bookingData: {}
                };
            } else {
                return {
                    text: "Your booking is already confirmed! If you'd like to start a new booking, reply \"restart\".",
                    newState: 'completed'
                };
            }

        default:            return {
                text: CONFIG.WELCOME_MESSAGE,
                newState: 'initial',
                bookingData: {}
            };
    }
}

module.exports = { handleMessage, CONFIG };