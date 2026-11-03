/**
 * Route table for image uploads, mounted at /api by server.js.
 *
 *   POST /api/upload  UploadImage (multipart/form-data, field name "image")
 *
 * Configures multer to validate and persist the uploaded file to
 * public/uploads/ before handing off to UploadController. Files are saved
 * under a collision-resistant name (`<timestamp>-<random hex><ext>`) rather
 * than the client-supplied filename.
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const UploadController = require("../controllers/UploadController");

const UPLOAD_DIR = path.join(__dirname, "..", "public", "uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = crypto.randomBytes(8).toString("hex");
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
    }
});

const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
]);

const upload = multer({
    storage,
    limits: {
        fileSize: 8 * 1024 * 1024 // 8MB
    },
    fileFilter: function (req, file, cb) {
        if (!ALLOWED_TYPES.has(file.mimetype)) {
            return cb(new Error("Only JPEG, PNG, GIF, and WEBP images are allowed"));
        }
        cb(null, true);
    }
});

// Wrapped manually (rather than passed straight to router.post) so multer
// errors — bad mimetype, file too large — return a JSON 400 instead of
// falling through to Express's default HTML error handler.
router.post("/upload", (req, res) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        UploadController.uploadImage(req, res);
    });
});

module.exports = router;
