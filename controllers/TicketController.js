/**
 * HTTP layer for `/api/tickets` and `/api/events/:eventId/tickets`.
 *
 * Each handler pulls request data, delegates to services/TicketService.js,
 * and maps the result to a status code + JSON body. No SQL or business
 * logic lives here.
 */

const TicketService = require("../services/TicketService");

/**
 * POST /api/events/:eventId/tickets
 * Creates a ticket under the given event from the request body.
 * 201 { ticketId } on success, 404 if the event doesn't exist, 500 on failure.
 */
function createTicket(req, res) {
    const ticket = req.body;
    const { eventId } = req.params;

    TicketService.createTicket(ticket, eventId, (err, ticketId) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to create ticket"
            });
        }

        if (!ticketId) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        return res.status(201).json({
            ticketId
        });
    });
}

/**
 * GET /api/tickets
 * 200 with the array of non-deleted tickets across all events.
 */
function getAllTickets(req, res) {
    TicketService.getAllTickets((err, tickets) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve tickets"
            });
        }

        return res.json(tickets);
    });
}

/**
 * GET /api/tickets/:ticketId
 * 200 with the ticket, 404 if it doesn't exist.
 */
function getTicketById(req, res) {
    const { ticketId } = req.params;

    TicketService.getTicketById(ticketId, (err, ticket) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve ticket"
            });
        }

        if (!ticket) {
            return res.status(404).json({
                error: "Ticket not found"
            });
        }

        return res.json(ticket);
    });
}

/**
 * GET /api/events/:eventId/tickets
 * 200 with the tickets belonging to the given event.
 */
function getTicketsByEventId(req, res) {
    const { eventId } = req.params;

    TicketService.getTicketsByEventId(eventId, (err, tickets) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve tickets for the event"
            });
        }

        return res.json(tickets);
    });
}

/**
 * PUT /api/tickets/:ticketId
 * Replaces the ticket's fields with the request body.
 * 200 on success, 404 if the ticket doesn't exist.
 */
function updateTicket(req, res) {
    const { ticketId } = req.params;

    const ticket = {
        ...req.body,
        ticket_id: ticketId
    };

    TicketService.updateTicket(ticket, (err, success) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to update ticket"
            });
        }

        if (!success) {
            return res.status(404).json({
                error: "Ticket not found"
            });
        }

        return res.json({
            message: "Ticket updated successfully"
        });
    });
}

/**
 * DELETE /api/tickets/:ticketId
 * Soft-deletes the ticket.
 * 204 on success, 404 if the ticket doesn't exist.
 */
function deleteTicket(req, res) {
    const { ticketId } = req.params;

    TicketService.deleteTicket(ticketId, (err, success) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to delete ticket"
            });
        }

        if (!success) {
            return res.status(404).json({
                error: "Ticket not found"
            });
        }

        return res.sendStatus(204);
    });
}

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    getTicketsByEventId,
    updateTicket,
    deleteTicket
};
