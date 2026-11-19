/**
 * HTTP layer for `/api/photos` and `/api/events/:eventId/photos`.
 *
 * Each handler pulls request data, delegates to services/PhotoService.js,
 * and maps the result to a status code + JSON body. No SQL or business
 * logic lives here.
 */

const PhotoService = require("../services/PhotoService");

/**
 * POST /api/events/:eventId/photos
 * Creates a photo under the given event from the request body.
 * 201 { photoId } on success, 404 if the event doesn't exist, 500 on failure.
 */
function createPhoto(req, res) {
    const photo = req.body;
    const { eventId } = req.params;

    PhotoService.createPhoto(photo, eventId, (err, photoId) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to create photo"
            });
        }

        if (!photoId) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        return res.status(201).json({
            photoId
        });
    });
}

/**
 * GET /api/photos
 * 200 with the array of non-deleted photos across all events.
 */
function getAllPhotos(req, res) {
    PhotoService.getAllPhotos((err, photos) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve photos"
            });
        }

        return res.json(photos);
    });
}

/**
 * GET /api/photos/:photoId
 * 200 with the photo, 404 if it doesn't exist.
 */
function getPhotoById(req, res) {
    const { photoId } = req.params;

    PhotoService.getPhotoById(photoId, (err, photo) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve photo"
            });
        }

        if (!photo) {
            return res.status(404).json({
                error: "Photo not found"
            });
        }

        return res.json(photo);
    });
}

/**
 * GET /api/events/:eventId/photos
 * 200 with the photos belonging to the given event.
 */
function getPhotosByEventId(req, res) {
    const { eventId } = req.params;

    PhotoService.getPhotosByEventId(eventId, (err, photos) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve photos for the event"
            });
        }

        return res.json(photos);
    });
}

/**
 * PUT /api/photos/:photoId
 * Replaces the photo's fields with the request body.
 * 200 on success, 404 if the photo doesn't exist.
 */
function updatePhoto(req, res) {
    const { photoId } = req.params;

    const photo = {
        ...req.body,
        photo_id: photoId
    };

    PhotoService.updatePhoto(photo, (err, success) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to update photo"
            });
        }

        if (!success) {
            return res.status(404).json({
                error: "Photo not found"
            });
        }

        return res.json({
            message: "Photo updated successfully"
        });
    });
}

/**
 * DELETE /api/photos/:photoId
 * Soft-deletes the photo.
 * 204 on success, 404 if the photo doesn't exist.
 */
function deletePhoto(req, res) {
    const { photoId } = req.params;

    PhotoService.deletePhoto(photoId, (err, success) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to delete photo"
            });
        }

        if (!success) {
            return res.status(404).json({
                error: "Photo not found"
            });
        }

        return res.sendStatus(204);
    });
}

module.exports = {
    createPhoto,
    getAllPhotos,
    getPhotoById,
    getPhotosByEventId,
    updatePhoto,
    deletePhoto
};
