/**
 * Business-logic layer for photos.
 *
 * Wraps models/Photo.js and adds the one rule that doesn't belong in the
 * data-access layer: a photo can't be created for an event that doesn't
 * exist. Controllers call this layer rather than the models directly.
 */

const Event = require("../models/Event");
const Photo = require("../models/Photo");

/**
 * Create a photo under an event, after confirming the event exists.
 * @param {object} singlePhoto See models/Photo.js#createPhoto for shape.
 * @param {number|string} eventId
 * @param {(err: Error|null, photoId?: number|null) => void} callback Resolves `null` when `eventId` doesn't match an event.
 */
function createPhoto(singlePhoto, eventId, callback) {
    Event.getEventById(eventId, (err, event) => {
        if (err) {
            return callback(err);
        }

        if (!event) {
            return callback(null, null);
        }

        Photo.createPhoto(singlePhoto, eventId, callback);
    });
}

/**
 * @param {(err: Error|null, photos?: object[]) => void} callback
 */
function getAllPhotos(callback) {
    Photo.getAllPhotos(callback);
}

/**
 * @param {number|string} photoId
 * @param {(err: Error|null, photo?: object|null) => void} callback
 */
function getPhotoById(photoId, callback) {
    Photo.getPhotoById(photoId, callback);
}

/**
 * @param {number|string} eventId
 * @param {(err: Error|null, photos?: object[]) => void} callback
 */
function getPhotosByEventId(eventId, callback) {
    Photo.getPhotosByEventId(eventId, callback);
}

/**
 * @param {object} singlePhoto See models/Photo.js#updatePhoto for shape.
 * @param {(err: Error|null, success?: boolean) => void} callback `success` is `false` when `photo_id` didn't match a row.
 */
function updatePhoto(singlePhoto, callback) {
    Photo.updatePhoto(singlePhoto, (err, updatedPhoto) => {
        if (err) {
            return callback(err);
        }

        callback(null, updatedPhoto !== null);
    });
}

/**
 * @param {number|string} photoId
 * @param {(err: Error|null, success?: boolean) => void} callback `success` is `false` when `photoId` didn't match a row.
 */
function deletePhoto(photoId, callback) {
    Photo.deletePhoto(photoId, (err, result) => {
        if (err) {
            return callback(err);
        }

        callback(null, result !== null);
    });
}

module.exports = {
    createPhoto,
    getAllPhotos,
    getPhotoById,
    getPhotosByEventId,
    updatePhoto,
    deletePhoto
}
