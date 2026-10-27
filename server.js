/**
 * App entry point: wires up the Express app, mounts every API route table
 * under /api, and serves the static frontend (public/) plus uploaded
 * images (public/uploads/) directly. Start with `npm start` (or `npm run
 * dev` for auto-reload).
 */

const express = require("express");
const path = require("path");

const eventRoutes = require("./routes/EventRoutes");
const memoryRoutes = require("./routes/MemoryRoutes");
const photoRoutes = require("./routes/PhotoRoutes");
const ticketRoutes = require("./routes/TicketRoutes");
const uploadRoutes = require("./routes/UploadRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.use("/api", eventRoutes);
app.use("/api", memoryRoutes);
app.use("/api", photoRoutes);
app.use("/api", ticketRoutes);
app.use("/api", uploadRoutes);

// Static frontend + uploaded images
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`Ticket Journal server running at http://localhost:${PORT}`);
});