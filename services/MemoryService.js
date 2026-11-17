/**
 * Business-logic layer for memories.
 *
 * Wraps models/Memory.js and adds the one rule that doesn't belong in the
 * data-access layer: a memory can't be created for an event that doesn't
 * exist. Controllers call this layer rather than the models directly.
 */

const Event = require("../models/Event");
const Memory = require("../models/Memory");

/**
 * Create a memory under an event, after confirming the event exists.
 * @param {object} singleMemory See models/Memory.js#createMemory for shape.
 * @param {number|string} eventId
 * @param {(err: Error|null, memoryId?: number|null) => void} callback Resolves `null` when `eventId` doesn't match an event.
 */
function createMemory(singleMemory, eventId, callback) {
    Event.getEventById(eventId, (err, event) => {
        if (err) {
            return callback(err);
        }

        if (!event) {
            return callback(null, null);
        }

        Memory.createMemory(singleMemory, eventId, callback);
    });
}

/**
 * @param {(err: Error|null, memories?: object[]) => void} callback
 */
function getAllMemories(callback) {
    Memory.getAllMemories(callback);
}

/**
 * @param {number|string} memoryId
 * @param {(err: Error|null, memory?: object|null) => void} callback
 */
function getMemoryById(memoryId, callback) {
    Memory.getMemoryById(memoryId, callback);
}

/**
 * @param {number|string} eventId
 * @param {(err: Error|null, memories?: object[]) => void} callback
 */
function getMemoriesByEventId(eventId, callback) {
    Memory.getMemoriesByEventId(eventId, callback);
}

/**
 * @param {object} singleMemory See models/Memory.js#updateMemory for shape.
 * @param {(err: Error|null, success?: boolean) => void} callback `success` is `false` when `memory_id` didn't match a row.
 */
function updateMemory(singleMemory, callback) {
    Memory.updateMemory(singleMemory, (err, updatedMemory) => {
        if (err) {
            return callback(err);
        }

        callback(null, updatedMemory !== null);
    });
}

/**
 * @param {number|string} memoryId
 * @param {(err: Error|null, success?: boolean) => void} callback `success` is `false` when `memoryId` didn't match a row.
 */
function deleteMemory(memoryId, callback) {
    Memory.deleteMemory(memoryId, (err, result) => {
        if (err) {
            return callback(err);
        }

        callback(null, result !== null);
    });
}

module.exports = {
    createMemory,
    getAllMemories,
    getMemoryById,
    getMemoriesByEventId,
    updateMemory,
    deleteMemory
}
