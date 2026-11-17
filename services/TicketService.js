/**
 * Business-logic layer for tickets.
 *
 * Wraps models/Ticket.js and adds the one rule that doesn't belong in the
 * data-access layer: a ticket can't be created for an event that doesn't
 * exist. Controllers call this layer rather than the models directly.
 */

const Ticket = require("../models/Ticket");
const Event = require("../models/Event")

/**
 * Create a ticket under an event, after confirming the event exists.
 * @param {object} singleTicket See models/Ticket.js#createTicket for shape.
 * @param {number|string} eventId
 * @param {(err: Error|null, ticketId?: number|null) => void} callback Resolves `null` when `eventId` doesn't match an event.
 */
function createTicket(singleTicket, eventId, callback) {
    Event.getEventById(eventId, (err, event) => {
        if (err) {
            return callback(err);
        }

        if (!event) {
            return callback(null, null);
        }

        Ticket.createTicket(singleTicket, eventId, callback);
    });
}

/**
 * @param {(err: Error|null, tickets?: object[]) => void} callback
 */
function getAllTickets(callback) {
    Ticket.getAllTickets(callback);
}

/**
 * @param {number|string} ticketId
 * @param {(err: Error|null, ticket?: object|null) => void} callback
 */
function getTicketById(ticketId, callback) {
    Ticket.getTicketById(ticketId, callback);
}

/**
 * @param {number|string} eventId
 * @param {(err: Error|null, tickets?: object[]) => void} callback
 */
function getTicketsByEventId(eventId, callback) {
    Ticket.getTicketsByEventId(eventId, callback);
}

/**
 * @param {object} singleTicket See models/Ticket.js#updateTicket for shape.
 * @param {(err: Error|null, success?: boolean) => void} callback `success` is `false` when `ticket_id` didn't match a row.
 */
function updateTicket(singleTicket, callback) {
    Ticket.updateTicket(singleTicket, (err, updatedTicket) => {
        if (err) {
            return callback(err);
        }

        callback(null, updatedTicket !== null);
    });
}

/**
 * @param {number|string} ticketId
 * @param {(err: Error|null, success?: boolean) => void} callback `success` is `false` when `ticketId` didn't match a row.
 */
function deleteTicket(ticketId, callback) {
    Ticket.deleteTicket(ticketId, (err, result) => {
        if (err) {
            return callback(err);
        }

        callback(null, result !== null);
    });
}

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    getTicketsByEventId,
    updateTicket,
    deleteTicket
}
