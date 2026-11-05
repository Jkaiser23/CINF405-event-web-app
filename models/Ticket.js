/**
 * Data-access layer for the `tickets` table.
 *
 * Every function talks directly to SQLite via `db/db.js` and follows the
 * Node error-first callback convention: `callback(err, result)`. No
 * business rules live here — that belongs to services/TicketService.js.
 * All reads/writes respect soft deletion (`deleted_at IS NULL`) except the
 * delete functions, which perform the soft delete itself.
 */

const db = require("../db/db");

/**
 * Fetch every non-deleted ticket across all events.
 * @param {(err: Error|null, tickets?: object[]) => void} callback
 */
function getAllTickets(callback) {
    const sql = `SELECT * FROM tickets WHERE deleted_at IS NULL`;

    db.all(sql, [], (err, tickets) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, tickets);
    });
}

/**
 * Fetch a single non-deleted ticket by id.
 * @param {number|string} ticketId
 * @param {(err: Error|null, ticket?: object|null) => void} callback Resolves `null` when no matching ticket exists.
 */
function getTicketById(ticketId, callback) {
    const sql = `
    SELECT * FROM tickets
    WHERE ticket_id = ?
    AND deleted_at IS NULL
    `;

    db.get(sql, [ticketId], (err, singleTicket) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, singleTicket || null);
    });
}

/**
 * Fetch every non-deleted ticket belonging to one event.
 * @param {number|string} eventId
 * @param {(err: Error|null, tickets?: object[]) => void} callback
 */
function getTicketsByEventId(eventId, callback) {
    const sql = `
    SELECT * FROM tickets
    WHERE event_id = ?
    And deleted_at IS NULL
    `;

    db.all(sql, [eventId], (err, tickets) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, tickets);
    });
}

/**
 * Insert a new ticket row under the given event. Caller is responsible for
 * verifying the event exists first (see services/TicketService.js).
 * @param {{ticket_seat?: string, ticket_row?: string, ticket_section?: string, ticket_image_path: string}} singleTicket
 * @param {number|string} eventId
 * @param {(err: Error|null, ticketId?: number) => void} callback Resolves the new row's `ticket_id` (SQLite `lastID`).
 */
function createTicket(singleTicket, eventId, callback) {
    const sql = `
    INSERT INTO tickets
    (event_id, ticket_seat, ticket_row, ticket_section, ticket_image_path)
    VALUES(?, ?, ?, ?, ?)
    `;

    const params = [
        eventId,
        singleTicket.ticket_seat,
        singleTicket.ticket_row,
        singleTicket.ticket_section,
        singleTicket.ticket_image_path
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return callback(err);
        }

        return callback(null, this.lastID);
    });
}

/**
 * Overwrite an existing ticket's editable fields. The ticket's `event_id`
 * is immutable and not part of this update.
 * @param {{ticket_id: number|string, ticket_seat?: string, ticket_row?: string, ticket_section?: string, ticket_image_path: string}} singleTicket
 * @param {(err: Error|null, updated?: object|null) => void} callback Resolves `null` when `ticket_id` didn't match a non-deleted row, otherwise the input object.
 */
function updateTicket(singleTicket, callback) {
    const sql = `
    UPDATE tickets
    SET ticket_seat = ?,
        ticket_row = ?,
        ticket_section = ?,
        ticket_image_path = ?
    WHERE ticket_id = ?
    AND deleted_at IS NULL
    `;

    const params = [
        singleTicket.ticket_seat,
        singleTicket.ticket_row,
        singleTicket.ticket_section,
        singleTicket.ticket_image_path,
        singleTicket.ticket_id
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return callback(err);
        }

        if (this.changes === 0) {
            return callback(null, null);
        }

        callback(null, singleTicket);
    });
}

/**
 * Soft-delete a single ticket by stamping `deleted_at`.
 * @param {number|string} ticketId
 * @param {(err: Error|null, changes?: number|null) => void} callback Resolves `null` when no non-deleted row matched, otherwise the number of rows changed (always 1).
 */
function deleteTicket(ticketId, callback) {
    const sql = `
    UPDATE tickets
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE ticket_id = ?
    AND deleted_at IS NULL
    `;

    db.run(sql, [ticketId], function (err) {
        if (err) {
            return callback(err);
        }

        if (this.changes === 0) {
            return callback(null, null);
        }

        return callback(null, this.changes);
    });
}

/**
 * Soft-delete every non-deleted ticket belonging to one event. Used when
 * an event itself is deleted (see services/EventService.js).
 * @param {number|string} eventId
 * @param {(err: Error|null, changes?: number) => void} callback Resolves the number of ticket rows changed (may be 0).
 */
function deleteTicketsByEventId(eventId, callback) {
    const sql = `
    UPDATE tickets
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE event_id = ?
    AND deleted_at IS NULL
    `;

    db.run(sql, [eventId], function (err) {
        if (err) {
            return callback(err);
        }

        return callback(null, this.changes);
    });
}

module.exports = {
    getAllTickets,
    getTicketById,
    getTicketsByEventId,
    createTicket,
    updateTicket,
    deleteTicket,
    deleteTicketsByEventId
};
