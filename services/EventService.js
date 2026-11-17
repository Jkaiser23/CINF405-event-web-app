/**
 * Business-logic layer for events.
 *
 * Wraps models/Event.js and coordinates the child models (Ticket, Photo,
 * Memory) for operations that span more than one table — assembling a full
 * event "detail" view and cascading soft deletes to an event's children.
 * Controllers call this layer rather than the models directly.
 */

const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const Photo = require("../models/Photo");
const Memory = require("../models/Memory");

/**
 * Create a new event.
 * @param {object} singleEvent See models/Event.js#createEvent for shape.
 * @param {(err: Error|null, eventId?: number) => void} callback
 */
function createEvent(singleEvent, callback) {
    Event.createEvent(singleEvent, callback);
}

/**
 * @param {(err: Error|null, events?: object[]) => void} callback
 */
function getAllEvents(callback) {
    Event.getAllEvents(callback);
}

/**
 * @param {number|string} eventId
 * @param {(err: Error|null, event?: object|null) => void} callback
 */
function getEventById(eventId, callback) {
    Event.getEventById(eventId, callback);
}

/**
 * Assemble the full detail view for an event: the event record plus all of
 * its tickets, photos, and memories. Used by the event detail page.
 * @param {number|string} eventId
 * @param {(err: Error|null, details?: {event: object, tickets: object[], photos: object[], memories: object[]}|null) => void} callback Resolves `null` when the event doesn't exist.
 */
function getEventDetails(eventId, callback) {
    Event.getEventById(eventId, (err, event) => {
        if (err) {
            return callback(err);
        }

        if (!event) {
            return callback(null, null);
        }

        Ticket.getTicketsByEventId(eventId, (err, tickets) => {
            if (err) {
                return callback(err);
            }

            Photo.getPhotosByEventId(eventId, (err, photos) => {
                if (err) {
                    return callback(err);
                }

                Memory.getMemoriesByEventId(eventId, (err, memories) => {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, {
                        event,
                        tickets,
                        photos,
                        memories
                    });
                });
            });
        });
    });

}

/**
 * @param {object} singleEvent See models/Event.js#updateEvent for shape.
 * @param {(err: Error|null, success?: boolean) => void} callback `success` is `false` when `event_id` didn't match a row.
 */
function updateEvent(singleEvent, callback) {
    Event.updateEvent(singleEvent, (err, updatedEvent) => {
        if (err) {
            return callback(err);
        }

        callback(null, updatedEvent !== null);
    });
}

/**
 * Soft-delete an event and cascade the soft delete to all of its memories,
 * photos, and tickets (in that order) so no orphaned children remain
 * visible. Verifies the event exists first so callers can distinguish
 * "not found" from a real failure.
 * @param {number|string} eventId
 * @param {(err: Error|null, success?: boolean) => void} callback `success` is `false` when the event doesn't exist.
 */
function deleteEvent(eventId, callback) {
    Event.getEventById(eventId, (err, event) => {
        if (err) {
            return callback(err);
        }

        if (!event) {
            return callback(null, false);
        }

        Memory.deleteMemoriesByEventId(eventId, (err) => {
            if (err) {
                return callback(err);
            }

            Photo.deletePhotosByEventId(eventId, (err) => {
                if (err) {
                    return callback(err);
                }

                Ticket.deleteTicketsByEventId(eventId, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    Event.deleteEvent(eventId, (err) => {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, true);
                    });
                });
            });
        });
    });
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    getEventDetails,
    updateEvent,
    deleteEvent,
}
