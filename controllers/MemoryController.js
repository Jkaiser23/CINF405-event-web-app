/**
 * HTTP layer for `/api/memories` and `/api/events/:eventId/memories`.
 *
 * Each handler pulls request data, delegates to services/MemoryService.js,
 * and maps the result to a status code + JSON body. No SQL or business
 * logic lives here.
 */

const MemoryService = require("../services/MemoryService");

/**
 * POST /api/events/:eventId/memories
 * Creates a memory under the given event from the request body.
 * 201 { memoryId } on success, 404 if the event doesn't exist, 500 on failure.
 */
function createMemory(req, res) {
    const memory = req.body;
    const { eventId } = req.params;

    MemoryService.createMemory(memory, eventId, (err, memoryId) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to create memory"
            });
        }

        if (!memoryId) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        return res.status(201).json({
            memoryId
        });
    });
}

/**
 * GET /api/memories
 * 200 with the array of non-deleted memories across all events.
 */
function getAllMemories(req, res) {
    MemoryService.getAllMemories((err, memories) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve memories"
            });
        }

        return res.json(memories);
    });
}

/**
 * GET /api/memories/:memoryId
 * 200 with the memory, 404 if it doesn't exist.
 */
function getMemoryById(req, res) {
    const { memoryId } = req.params;

    MemoryService.getMemoryById(memoryId, (err, memory) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve memory"
            });
        }

        if (!memory) {
            return res.status(404).json({
                error: "Memory not found"
            });
        }

        return res.json(memory);
    });
}

/**
 * GET /api/events/:eventId/memories
 * 200 with the memories belonging to the given event.
 */
function getMemoriesByEventId(req, res) {
    const { eventId } = req.params;

    MemoryService.getMemoriesByEventId(eventId, (err, memories) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve memories for the event"
            });
        }

        return res.json(memories);
    });
}

/**
 * PUT /api/memories/:memoryId
 * Replaces the memory's text content with the request body.
 * 200 on success, 404 if the memory doesn't exist.
 */
function updateMemory(req, res) {
    const { memoryId } = req.params;

    const memory = {
        ...req.body,
        memory_id: memoryId
    };

    MemoryService.updateMemory(memory, (err, success) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to update memory"
            });
        }

        if (!success) {
            return res.status(404).json({
                error: "Memory not found"
            });
        }

        return res.json({
            message: "Memory updated successfully"
        });
    });
}

/**
 * DELETE /api/memories/:memoryId
 * Soft-deletes the memory.
 * 204 on success, 404 if the memory doesn't exist.
 */
function deleteMemory(req, res) {
    const { memoryId } = req.params;

    MemoryService.deleteMemory(memoryId, (err, success) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to delete memory"
            });
        }

        if (!success) {
            return res.status(404).json({
                error: "Memory not found"
            });
        }

        return res.sendStatus(204);
    });
}

module.exports = {
    createMemory,
    getAllMemories,
    getMemoryById,
    getMemoriesByEventId,
    updateMemory,
    deleteMemory
};
