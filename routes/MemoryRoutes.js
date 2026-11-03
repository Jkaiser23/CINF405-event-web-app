/**
 * Route table for memories, mounted at /api by server.js.
 *
 *   GET    /api/events/:eventId/memories  GetMemoriesByEventId
 *   POST   /api/events/:eventId/memories  CreateMemory
 *   GET    /api/memories                  GetAllMemories
 *   GET    /api/memories/:memoryId        GetMemoryById
 *   PUT    /api/memories/:memoryId        UpdateMemory
 *   DELETE /api/memories/:memoryId        DeleteMemory
 */

const express = require("express");
const router = express.Router();

const MemoryController = require("../controllers/MemoryController");

router.get("/events/:eventId/memories", MemoryController.getMemoriesByEventId);
router.post("/events/:eventId/memories", MemoryController.createMemory);

router.get("/memories", MemoryController.getAllMemories);
router.get("/memories/:memoryId", MemoryController.getMemoryById);
router.put("/memories/:memoryId", MemoryController.updateMemory);
router.delete("/memories/:memoryId", MemoryController.deleteMemory);

module.exports = router;
