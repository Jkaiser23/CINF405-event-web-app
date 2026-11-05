/**
 * Data-access layer for the `photos` table.
 *
 * Every function talks directly to SQLite via `db/db.js` and follows the
 * Node error-first callback convention: `callback(err, result)`. No
 * business rules live here — that belongs to services/PhotoService.js.
 * All reads/writes respect soft deletion (`deleted_at IS NULL`) except the
 * delete functions, which perform the soft delete itself.
 */

const db = require("../db/db");

/**
 * Fetch every non-deleted photo across all events.
 * @param {(err: Error|null, photos?: object[]) => void} callback
 */
function getAllPhotos(callback) {
    const sql = `SELECT * FROM photos WHERE deleted_at IS NULL`;

    db.all(sql, [], (err, photos) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, photos);
    });
}

/**
 * Fetch a single non-deleted photo by id.
 * @param {number|string} photoId
 * @param {(err: Error|null, photo?: object|null) => void} callback Resolves `null` when no matching photo exists.
 */
function getPhotoById(photoId, callback) {
    const sql = `
    SELECT * FROM photos
    WHERE photo_id = ?
    AND deleted_at IS NULL
    `;

    db.get(sql, [photoId], (err, singlePhoto) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, singlePhoto || null);
    });
}

/**
 * Fetch every non-deleted photo belonging to one event.
 * @param {number|string} eventId
 * @param {(err: Error|null, photos?: object[]) => void} callback
 */
function getPhotosByEventId(eventId, callback) {
    const sql = `
    SELECT * FROM photos
    WHERE event_id = ?
    And deleted_at IS NULL
    `;

    db.all(sql, [eventId], (err, photos) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, photos);
    });
}

/**
 * Insert a new photo row under the given event. Caller is responsible for
 * verifying the event exists first (see services/PhotoService.js).
 * @param {{photo_file_path: string, photo_caption?: string}} singlePhoto
 * @param {number|string} eventId
 * @param {(err: Error|null, photoId?: number) => void} callback Resolves the new row's `photo_id` (SQLite `lastID`).
 */
function createPhoto(singlePhoto, eventId, callback) {
    const sql = `
    INSERT INTO photos
    (event_id, photo_file_path, photo_caption)
    VALUES(?, ?, ?)
    `;

    const params = [
        eventId,
        singlePhoto.photo_file_path,
        singlePhoto.photo_caption
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return callback(err);
        }

        return callback(null, this.lastID);
    });
}

/**
 * Overwrite an existing photo's editable fields. The photo's `event_id`
 * is immutable and not part of this update.
 * @param {{photo_id: number|string, photo_file_path: string, photo_caption?: string}} singlePhoto
 * @param {(err: Error|null, updated?: object|null) => void} callback Resolves `null` when `photo_id` didn't match a non-deleted row, otherwise the input object.
 */
function updatePhoto(singlePhoto, callback) {
    const sql = `
    UPDATE photos
    SET photo_file_path = ?,
        photo_caption = ?
    WHERE photo_id = ?
    AND deleted_at IS NULL
    `;

    const params = [
        singlePhoto.photo_file_path,
        singlePhoto.photo_caption,
        singlePhoto.photo_id
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return callback(err);
        }

        if (this.changes === 0) {
            return callback(null, null);
        }

        callback(null, singlePhoto);
    });
}

/**
 * Soft-delete a single photo by stamping `deleted_at`.
 * @param {number|string} photoId
 * @param {(err: Error|null, changes?: number|null) => void} callback Resolves `null` when no non-deleted row matched, otherwise the number of rows changed (always 1).
 */
function deletePhoto(photoId, callback) {
    const sql = `
    UPDATE photos
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE photo_id = ?
    AND deleted_at IS NULL
    `;

    db.run(sql, [photoId], function (err) {
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
 * Soft-delete every non-deleted photo belonging to one event. Used when
 * an event itself is deleted (see services/EventService.js).
 * @param {number|string} eventId
 * @param {(err: Error|null, changes?: number) => void} callback Resolves the number of photo rows changed (may be 0).
 */
function deletePhotosByEventId(eventId, callback) {
    const sql = `
    UPDATE photos
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
    getAllPhotos,
    getPhotoById,
    getPhotosByEventId,
    createPhoto,
    updatePhoto,
    deletePhoto,
    deletePhotosByEventId
};
