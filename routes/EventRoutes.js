/**
 * Route table for events, mounted at /api by server.js.
 *
 *   POST   /api/events                CreateEvent
 *   GET    /api/events                GetAllEvents
 *   GET    /api/events/:eventId       GetEventById
 *   PUT    /api/events/:eventId       UpdateEvent
 *   DELETE /api/events/:eventId       DeleteEvent
 *   GET    /api/events/:eventId/details  GetEventDetails (event + tickets + photos + memories)
 */

const express = require("express");
const router = express.Router();

const EventController = require("../controllers/EventController");

router.post("/events", EventController.createEvent);
router.get("/events", EventController.getAllEvents);

router.get("/events/:eventId", EventController.getEventById);
router.put("/events/:eventId", EventController.updateEvent);
router.delete("/events/:eventId", EventController.deleteEvent);

router.get("/events/:eventId/details", EventController.getEventDetails);

module.exports = router;
