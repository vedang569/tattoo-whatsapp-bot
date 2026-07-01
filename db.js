const Database = require('better-sqlite3');
const db = new Database('tattoo_bot.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS conversation_state (
    phone TEXT PRIMARY KEY,
    state TEXT,
    data TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT,
    details TEXT,
    slot TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const dbHelpers = {
    getState: (phone) => {
        const row = db.prepare('SELECT state, data FROM conversation_state WHERE phone = ?').get(phone);
        if (row) {
            return { state: row.state, data: JSON.parse(row.data) };
        }
        return { state: 'initial', data: {} };
    },

    saveState: (phone, state, data) => {
        const query = db.prepare('INSERT OR REPLACE INTO conversation_state (phone, state, data) VALUES (?, ?, ?)');
        query.run(phone, state, JSON.stringify(data));
    },

    saveBooking: (phone, details, slot, status) => {
        const query = db.prepare('INSERT INTO bookings (phone, details, slot, status) VALUES (?, ?, ?, ?)');
        return query.run(phone, details, slot, status).lastInsertRowid;
    },

    updateBookingStatus: (phone, status) => {
        // Fix: Use single quotes for string literals in SQL
        const query = db.prepare("UPDATE bookings SET status = ? WHERE phone = ? AND status = 'pending_payment'");
        query.run(status, phone);
    },

    getAllBookings: () => {
        return db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    }
};

module.exports = dbHelpers;