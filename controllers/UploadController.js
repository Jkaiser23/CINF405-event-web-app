/**
 * HTTP layer for `/api/upload`.
 *
 * File validation and disk storage are handled by the multer middleware
 * configured in routes/UploadRoutes.js before this controller runs; by the
 * time `uploadImage` executes, `req.file` is either a valid saved file or
 * absent.
 */

/**
 * POST /api/upload
 * Returns the public path of the just-uploaded image so it can be attached
 * to a ticket or photo record.
 * 201 { path } on success, 400 if no file was provided.
 */
function uploadImage(req, res) {
    if (!req.file) {
        return res.status(400).json({
            error: "No image file was provided"
        });
    }

    return res.status(201).json({
        path: `/uploads/${req.file.filename}`
    });
}

module.exports = {
    uploadImage
};
