/**
 * Data-access layer for the `events` table.
 *
 * Every function talks directly to SQLite via `db/db.js` and follows the
 * Node error-first callback convention: `callback(err, result)`. No
 * business rules live here (e.g. cascading deletes to tickets/photos/
 * memories) — that belongs to services/EventService.js. All reads/writes
 * respect soft deletion (`deleted_at IS NULL`) except `deleteEvent`, which
 * performs the soft delete itself.
 */

const db = require("../db/db");

/**
 * Fetch every non-deleted event.
 * @param {(err: Error|null, events?: object[]) => void} callback
 */
function getAllEvents(callback) {
    const sql = `SELECT * FROM events WHERE deleted_at IS NULL`;

    db.all(sql, [], (err, events) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, events);
    });
}

/**
 * Fetch a single non-deleted event by id.
 * @param {number|string} eventId
 * @param {(err: Error|null, event?: object|null) => void} callback Resolves `null` when no matching event exists.
 */
function getEventById(eventId, callback) {
    const sql = `
    SELECT * FROM events
    WHERE event_id = ?
    AND deleted_at IS NULL
    `;

    db.get(sql, [eventId], (err, singleEvent) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, singleEvent || null);
    });
}

/**
 * Insert a new event row.
 * @param {{event_date: string, event_location?: string, event_type: string, event_venue?: string, event_title: string}} singleEvent
 * @param {(err: Error|null, eventId?: number) => void} callback Resolves the new row's `event_id` (SQLite `lastID`).
 */
function createEvent(singleEvent, callback) {
    const sql = `
    INSERT INTO events
    (event_date, event_location, event_type, event_venue, event_title)
    VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
        singleEvent.event_date,
        singleEvent.event_location,
        singleEvent.event_type,
        singleEvent.event_venue,
        singleEvent.event_title
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return callback(err);
        }

        return callback(null, this.lastID);
    });
}

/**
 * Overwrite every field of an existing event.
 * @param {{event_id: number|string, event_date: string, event_location?: string, event_type: string, event_venue?: string, event_title: string}} singleEvent
 * @param {(err: Error|null, updated?: object|null) => void} callback Resolves `null` when `event_id` didn't match a row, otherwise the input object.
 */
function updateEvent(singleEvent, callback) {
    const sql = `
    UPDATE events
    SET event_date = ?,
        event_location = ?,
        event_type = ?,
        event_venue = ?,
        event_title = ?
    WHERE event_id = ?
    `;

    const params = [
        singleEvent.event_date,
        singleEvent.event_location,
        singleEvent.event_type,
        singleEvent.event_venue,
        singleEvent.event_title,
        singleEvent.event_id
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return callback(err);
        }

        if (this.changes === 0) {
            return callback(null, null);
        }

        callback(null, singleEvent);
    });
}

/**
 * Soft-delete an event by stamping `deleted_at`. Does not touch the
 * event's tickets/photos/memories — callers needing cascading deletes
 * should use services/EventService.js instead.
 * @param {number|string} eventId
 * @param {(err: Error|null, changes?: number|null) => void} callback Resolves `null` when no row matched, otherwise the number of rows changed (always 1).
 */
function deleteEvent(eventId, callback) {
    const sql = `
    UPDATE events
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE event_id = ?
    `;

    db.run(sql, [eventId], function (err) {
        if (err) {
            return callback(err);
        }

        if (this.changes === 0) {
            return callback(null, null);
        }

        return callback(null, this.changes);
    });
}

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
