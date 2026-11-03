/**
 * Shared SQLite connection for the app.
 *
 * Opens (or creates) `db/ticket-journal.db` once and exports the connected
 * `sqlite3.Database` instance so every model can `require` the same
 * connection instead of opening its own.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "ticket-journal.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to connect to database:", err.message);
    } else {
        console.log("Connected to SQLite database");
        // Required every connection: SQLite does not enforce FK constraints by default.
        db.run("PRAGMA foreign_keys = ON");
    }
});

module.exports = db;
