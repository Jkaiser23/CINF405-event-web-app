-- Ticket Journal database schema (SQLite).
--
-- One "event" (a concert, game, show, etc.) owns zero or more tickets,
-- photos, and memories. All child tables cascade-delete manually via the
-- service layer (see services/EventService.js) rather than SQL ON DELETE
-- CASCADE, since rows are soft-deleted, not removed.
--
-- Soft deletes: every table has a nullable `deleted_at` timestamp instead of
-- being physically removed on delete. Application queries always filter on
-- `deleted_at IS NULL`; this file only defines structure, not that filter.
--
-- Run via `npm run db:init` (see db/init.js). This DROPS and recreates all
-- tables, so re-running wipes existing data.

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS memories;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS events;

-- An event is the top-level record everything else hangs off of.
CREATE TABLE events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_date TEXT NOT NULL,
    event_location TEXT,
    event_type TEXT NOT NULL,
    event_venue TEXT,
    event_title TEXT NOT NULL,
    deleted_at TEXT DEFAULT NULL
);

-- A physical/digital ticket stub belonging to one event.
CREATE TABLE tickets (
    ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    ticket_seat TEXT,
    ticket_row TEXT,
    ticket_section TEXT,
    ticket_image_path TEXT NOT NULL,
    deleted_at TEXT DEFAULT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- A photo (with optional caption) attached to one event.
CREATE TABLE photos (
    photo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    photo_file_path TEXT NOT NULL,
    photo_caption TEXT,
    photo_created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT DEFAULT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- A free-text journal entry attached to one event.
CREATE TABLE memories (
    memory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    memory_text_content TEXT NOT NULL,
    memory_created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT DEFAULT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);
