/**
 * HTTP layer for `/api/events`.
 *
 * Each handler pulls request data, delegates to services/EventService.js,
 * and maps the result to a status code + JSON body. No SQL or business
 * logic lives here.
 */

const EventService = require("../services/EventService");

/**
 * POST /api/events
 * Creates an event from the request body.
 * 201 { eventId } on success, 500 on failure.
 */
function createEvent(req, res) {
    const event = req.body;

    EventService.createEvent(event, (err, eventId) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to create event"
            });
        }

        return res.status(201).json({
            eventId
        });
    });
}

/**
 * GET /api/events
 * 200 with the array of non-deleted events.
 */
function getAllEvents(req, res) {
    EventService.getAllEvents((err, events) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve events"
            });
        }

        return res.json(events);
    });
}

/**
 * GET /api/events/:eventId
 * 200 with the event, 404 if it doesn't exist.
 */
function getEventById(req, res) {
    const { eventId } = req.params;

    EventService.getEventById(eventId, (err, event) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve event"
            });
        }

        if (!event) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        return res.json(event);
    });
}

/**
 * GET /api/events/:eventId/details
 * 200 with the event plus its tickets, photos, and memories; 404 if the
 * event doesn't exist. Backs the event detail page.
 */
function getEventDetails(req, res) {
    const { eventId } = req.params;

    EventService.getEventDetails(eventId, (err, eventDetails) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve event details"
            });
        }

        if (!eventDetails) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        return res.json(eventDetails);
    });
}

/**
 * PUT /api/events/:eventId
 * Replaces the event's fields with the request body.
 * 200 on success, 404 if the event doesn't exist.
 */
function updateEvent(req, res) {
    const { eventId } = req.params;

    const event = {
        ...req.body,
        event_id: eventId
    };

    EventService.updateEvent(event, (err, success) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to update event"
            });
        }

        if (!success) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        return res.json({
            message: "Event updated successfully"
        });
    });
}

/**
 * DELETE /api/events/:eventId
 * Soft-deletes the event and cascades to its tickets, photos, and
 * memories (see services/EventService.js#deleteEvent).
 * 204 on success, 404 if the event doesn't exist.
 */
function deleteEvent(req, res) {
    const { eventId } = req.params;

    EventService.deleteEvent(eventId, (err, success) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to delete event"
            });
        }

        if (!success) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        return res.sendStatus(204);
    });
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    getEventDetails,
    updateEvent,
    deleteEvent
};
