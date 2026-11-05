/**
 * Data-access layer for the `memories` table.
 *
 * Every function talks directly to SQLite via `db/db.js` and follows the
 * Node error-first callback convention: `callback(err, result)`. No
 * business rules live here — that belongs to services/MemoryService.js.
 * All reads/writes respect soft deletion (`deleted_at IS NULL`) except the
 * delete functions, which perform the soft delete itself.
 */

const db = require("../db/db");

/**
 * Fetch every non-deleted memory across all events.
 * @param {(err: Error|null, memories?: object[]) => void} callback
 */
function getAllMemories(callback) {
    const sql = `SELECT * FROM memories WHERE deleted_at IS NULL`;

    db.all(sql, [], (err, memories) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, memories);
    });
}

/**
 * Fetch a single non-deleted memory by id.
 * @param {number|string} memoryId
 * @param {(err: Error|null, memory?: object|null) => void} callback Resolves `null` when no matching memory exists.
 */
function getMemoryById(memoryId, callback) {
    const sql = `
    SELECT * FROM memories
    WHERE memory_id = ?
    AND deleted_at IS NULL
    `;

    db.get(sql, [memoryId], (err, singleMemory) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, singleMemory || null);
    });
}

/**
 * Fetch every non-deleted memory belonging to one event.
 * @param {number|string} eventId
 * @param {(err: Error|null, memories?: object[]) => void} callback
 */
function getMemoriesByEventId(eventId, callback) {
    const sql = `
    SELECT * FROM memories
    WHERE event_id = ?
    And deleted_at IS NULL
    `;

    db.all(sql, [eventId], (err, memories) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, memories);
    });
}

/**
 * Insert a new memory row under the given event. Caller is responsible for
 * verifying the event exists first (see services/MemoryService.js).
 * @param {{memory_text_content: string}} singleMemory
 * @param {number|string} eventId
 * @param {(err: Error|null, memoryId?: number) => void} callback Resolves the new row's `memory_id` (SQLite `lastID`).
 */
function createMemory(singleMemory, eventId, callback) {
    const sql = `
    INSERT INTO memories
    (event_id, memory_text_content)
    VALUES (?, ?)
    `;

    const params = [
        eventId,
        singleMemory.memory_text_content
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return callback(err);
        }

        return callback(null, this.lastID);
    });
}

/**
 * Overwrite an existing memory's text content. The memory's `event_id`
 * is immutable and not part of this update.
 * @param {{memory_id: number|string, memory_text_content: string}} singleMemory
 * @param {(err: Error|null, updated?: object|null) => void} callback Resolves `null` when `memory_id` didn't match a non-deleted row, otherwise the input object.
 */
function updateMemory(singleMemory, callback) {
    const sql = `
    UPDATE memories
    SET memory_text_content = ?
    WHERE memory_id = ?
    AND deleted_at IS NULL
    `;

    const params = [
        singleMemory.memory_text_content,
        singleMemory.memory_id
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return callback(err);
        }

        if (this.changes === 0) {
            return callback(null, null);
        }

        callback(null, singleMemory);
    });
}

/**
 * Soft-delete a single memory by stamping `deleted_at`.
 * @param {number|string} memoryId
 * @param {(err: Error|null, changes?: number|null) => void} callback Resolves `null` when no non-deleted row matched, otherwise the number of rows changed (always 1).
 */
function deleteMemory(memoryId, callback) {
    const sql = `
    UPDATE memories
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE memory_id = ?
    AND deleted_at IS NULL
    `;

    db.run(sql, [memoryId], function (err) {
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
 * Soft-delete every non-deleted memory belonging to one event. Used when
 * an event itself is deleted (see services/EventService.js).
 * @param {number|string} eventId
 * @param {(err: Error|null, changes?: number) => void} callback Resolves the number of memory rows changed (may be 0).
 */
function deleteMemoriesByEventId(eventId, callback) {
    const sql = `
    UPDATE memories
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
    getAllMemories,
    getMemoryById,
    getMemoriesByEventId,
    createMemory,
    updateMemory,
    deleteMemory,
    deleteMemoriesByEventId
};
