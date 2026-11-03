/**
 * Route table for tickets, mounted at /api by server.js.
 *
 *   GET    /api/events/:eventId/tickets  GetTicketsByEventId
 *   POST   /api/events/:eventId/tickets  CreateTicket
 *   GET    /api/tickets                  GetAllTickets
 *   GET    /api/tickets/:ticketId        GetTicketById
 *   PUT    /api/tickets/:ticketId        UpdateTicket
 *   DELETE /api/tickets/:ticketId        DeleteTicket
 */

const express = require("express");
const router = express.Router();

const TicketController = require("../controllers/TicketController");

router.get("/events/:eventId/tickets", TicketController.getTicketsByEventId);
router.post("/events/:eventId/tickets", TicketController.createTicket);

router.get("/tickets", TicketController.getAllTickets);
router.get("/tickets/:ticketId", TicketController.getTicketById);
router.put("/tickets/:ticketId", TicketController.updateTicket);
router.delete("/tickets/:ticketId", TicketController.deleteTicket);

module.exports = router;
