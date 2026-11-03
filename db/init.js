/**
 * One-off script that (re)creates the SQLite database from schema.sql.
 *
 * Running this drops and recreates every table (see schema.sql), so all
 * existing data is lost. Intended for local/dev setup, not for use against
 * a database with data you want to keep.
 *
 * Usage: node db/init.js (or `npm run db:init`)
 */

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "ticket-journal.db");
const schemaPath = path.join(__dirname, "..", "schema.sql");

const schema = fs.readFileSync(schemaPath, "utf8");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to open database:", err.message);
        process.exit(1);
    }
});

db.exec(schema, (err) => {
    if (err) {
        console.error("Failed to run schema:", err.message);
        process.exit(1);
    }

    console.log("Database initialized at", dbPath);
    db.close();
});
