"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrack = exports.updateTrack = exports.addTrack = exports.gettrackBytrackId = exports.getTracks = void 0;
const musicLibrarySQLDataStore_1 = require("../dataStores/musicLibrarySQLDataStore");
const uuid_1 = require("uuid");
const getTracks = async (req, res) => {
    const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;
    if (artist_id !== undefined && !(0, uuid_1.validate)(artist_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid arist_id format',
            error: null,
        });
        return;
    }
    if (album_id !== undefined && !(0, uuid_1.validate)(album_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid album_id format',
            error: null,
        });
        return;
    }
    try {
        const artists = await (0, musicLibrarySQLDataStore_1.geTracksFromDB)(limit, offset, artist_id, album_id, hidden);
        res.status(200).json({
            status: 200,
            data: artists,
            message: 'Tracks retrieved successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching tracks.',
            error: error.stack,
        });
    }
};
exports.getTracks = getTracks;
const gettrackBytrackId = async (req, res) => {
    const { track_id } = req.params;
    const track_input = { track_id: track_id };
    if (!(0, uuid_1.validate)(track_input === null || track_input === void 0 ? void 0 : track_input.track_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid track ID format',
            error: null,
        });
        return;
    }
    try {
        const track = await (0, musicLibrarySQLDataStore_1.getExistingTrack)(track_input);
        if (!track) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'track not found.',
                error: null,
            });
            return;
        }
        res.status(200).json({
            status: 200,
            data: track[0],
            message: "tracks retrieved successfully.",
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching track.',
            error: error.stack,
        });
    }
};
exports.gettrackBytrackId = gettrackBytrackId;
const addTrack = async (req, res) => {
    var _a, _b;
    const trackInput = req.body;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Admin' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'Editor') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }
    if (!(trackInput === null || trackInput === void 0 ? void 0 : trackInput.album_id) || !(trackInput === null || trackInput === void 0 ? void 0 : trackInput.artist_id) || !(trackInput === null || trackInput === void 0 ? void 0 : trackInput.name) || (trackInput === null || trackInput === void 0 ? void 0 : trackInput.duration) === undefined || (trackInput === null || trackInput === void 0 ? void 0 : trackInput.hidden) === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: album_id, artist_id, name, duration, hidden all fields are mandatory.',
            error: null,
        });
        return;
    }
    try {
        const getArtist = await (0, musicLibrarySQLDataStore_1.getExtistingArtist)({ artist_id: trackInput.artist_id });
        if (!getArtist) {
            await res.status(404).json({
                status: 303,
                data: null,
                message: 'Artist not found.',
                error: null,
            });
        }
        const existingAlbum = await (0, musicLibrarySQLDataStore_1.getExistingAlbum)({ album_id: trackInput.album_id });
        if (!existingAlbum) {
            await res.status(409).json({
                status: 409,
                data: null,
                message: 'Album not exists.',
                error: null,
            });
            return;
        }
        const existingtrack = await (0, musicLibrarySQLDataStore_1.getExistingTrack)(trackInput);
        if (existingtrack) {
            await res.status(409).json({
                status: 409,
                data: null,
                message: 'Track already exists.',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.addNewTrack)(trackInput);
        res.status(201).json({
            status: 201,
            data: null,
            message: 'track created successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while adding the track.',
            error: error.stack,
        });
    }
};
exports.addTrack = addTrack;
const updateTrack = async (req, res) => {
    var _a, _b;
    const trackInput = req.body;
    const { track_id } = req.params;
    trackInput.track_id = track_id;
    if (!(0, uuid_1.validate)(trackInput === null || trackInput === void 0 ? void 0 : trackInput.track_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Artist ID format',
            error: null,
        });
        return;
    }
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Admin' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'Editor') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }
    if (!(trackInput === null || trackInput === void 0 ? void 0 : trackInput.name) && (trackInput === null || trackInput === void 0 ? void 0 : trackInput.duration) === undefined && (trackInput === null || trackInput === void 0 ? void 0 : trackInput.hidden) === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: No fields to Update',
            error: null,
        });
        return;
    }
    try {
        const existingtrack = await (0, musicLibrarySQLDataStore_1.getExistingTrack)(trackInput);
        if (!existingtrack) {
            await res.status(404).json({
                status: 404,
                data: null,
                message: 'track does not exists',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.updateTrackInDB)(trackInput);
        res.status(204).json({
            status: 204,
            data: null,
            message: 'track updated successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while updating the track.',
            error: error.stack,
        });
    }
};
exports.updateTrack = updateTrack;
const deleteTrack = async (req, res) => {
    var _a, _b, _c;
    const { track_id } = req.params;
    const trackInput = { track_id: track_id };
    if (!(0, uuid_1.validate)(trackInput === null || trackInput === void 0 ? void 0 : trackInput.track_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid track ID format',
            error: null,
        });
        return;
    }
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Admin' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'Editor') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }
    try {
        const existingTrack = await (0, musicLibrarySQLDataStore_1.getExistingTrack)(trackInput);
        if (!existingTrack) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'track not found',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.deleteTrackFromDB)(trackInput);
        res.status(200).json({
            status: 200,
            data: null,
            message: `Track:${(_c = existingTrack[0]) === null || _c === void 0 ? void 0 : _c.name} deleted successfully.`,
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while Deleting the track.',
            error: error.stack,
        });
    }
};
exports.deleteTrack = deleteTrack;
//# sourceMappingURL=trackService.js.map