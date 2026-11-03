/**
 * Route table for photos, mounted at /api by server.js.
 *
 *   GET    /api/events/:eventId/photos  GetPhotosByEventId
 *   POST   /api/events/:eventId/photos  CreatePhoto
 *   GET    /api/photos                  GetAllPhotos
 *   GET    /api/photos/:photoId         GetPhotoById
 *   PUT    /api/photos/:photoId         UpdatePhoto
 *   DELETE /api/photos/:photoId         DeletePhoto
 */

const express = require("express");
const router = express.Router();

const PhotoController = require("../controllers/PhotoController");

router.get("/events/:eventId/photos", PhotoController.getPhotosByEventId);
router.post("/events/:eventId/photos", PhotoController.createPhoto);

router.get("/photos", PhotoController.getAllPhotos);
router.get("/photos/:photoId", PhotoController.getPhotoById);
router.put("/photos/:photoId", PhotoController.updatePhoto);
router.delete("/photos/:photoId", PhotoController.deletePhoto);

module.exports = router;
