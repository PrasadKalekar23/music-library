"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArtist = exports.updateArtist = exports.addArtist = exports.getArtistByArtistId = exports.getArtists = void 0;
const musicLibrarySQLDataStore_1 = require("../dataStores/musicLibrarySQLDataStore");
const uuid_1 = require("uuid");
const getArtists = async (req, res) => {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;
    try {
        const artists = await (0, musicLibrarySQLDataStore_1.geArtistsFromDB)(limit, offset, grammy, hidden);
        res.status(200).json({
            status: 200,
            data: artists,
            message: 'Artists retrieved successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching Artists.',
            error: error.stack,
        });
    }
};
exports.getArtists = getArtists;
const getArtistByArtistId = async (req, res) => {
    const { artist_id } = req.params;
    const artist_input = { artist_id: artist_id };
    if (!(0, uuid_1.validate)(artist_input === null || artist_input === void 0 ? void 0 : artist_input.artist_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Artist ID format',
            error: null,
        });
        return;
    }
    try {
        const artist = await (0, musicLibrarySQLDataStore_1.getExtistingArtist)(artist_input);
        if (!artist) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null,
            });
            return;
        }
        res.status(200).json({
            status: 200,
            data: artist[0],
            message: 'Artist retrieved successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching Artist.',
            error: error.stack,
        });
    }
};
exports.getArtistByArtistId = getArtistByArtistId;
const addArtist = async (req, res) => {
    var _a, _b;
    const artistInput = req.body;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Admin' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'Editor') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }
    if (!(artistInput === null || artistInput === void 0 ? void 0 : artistInput.name) || (artistInput === null || artistInput === void 0 ? void 0 : artistInput.grammy) === undefined || (artistInput === null || artistInput === void 0 ? void 0 : artistInput.hidden) === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: name, grammy, hidden all fields are mandatory.',
            error: null,
        });
        return;
    }
    try {
        const existingUser = await (0, musicLibrarySQLDataStore_1.getExtistingArtist)(artistInput);
        if (existingUser) {
            res.status(409).json({
                status: 409,
                data: null,
                message: 'Artist already exists.',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.addNewArtist)(artistInput);
        res.status(201).json({
            status: 201,
            data: null,
            message: 'Artist created successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while adding the Artist.',
            error: error.stack,
        });
    }
};
exports.addArtist = addArtist;
const updateArtist = async (req, res) => {
    var _a, _b;
    const artistInput = req.body;
    const { artist_id } = req.params;
    artistInput.artist_id = artist_id;
    if (!(0, uuid_1.validate)(artistInput === null || artistInput === void 0 ? void 0 : artistInput.artist_id)) {
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
    if (!(artistInput === null || artistInput === void 0 ? void 0 : artistInput.name) && (artistInput === null || artistInput === void 0 ? void 0 : artistInput.grammy) === undefined && (artistInput === null || artistInput === void 0 ? void 0 : artistInput.hidden) === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: No fields to Update',
            error: null,
        });
        return;
    }
    try {
        const existingUser = await (0, musicLibrarySQLDataStore_1.getExtistingArtist)(artistInput);
        if (!existingUser) {
            res.status(409).json({
                status: 409,
                data: null,
                message: 'Artist not found',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.updateArtistInDB)(artistInput);
        res.status(204).json({
            status: 204,
            data: null,
            message: 'Artist created successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while updating the Artist.',
            error: error.stack,
        });
    }
};
exports.updateArtist = updateArtist;
const deleteArtist = async (req, res) => {
    var _a, _b;
    const { artist_id } = req.params;
    const artistInput = { artist_id: artist_id };
    if (!(0, uuid_1.validate)(artistInput === null || artistInput === void 0 ? void 0 : artistInput.artist_id)) {
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
    try {
        const existingArtist = await (0, musicLibrarySQLDataStore_1.getExtistingArtist)(artistInput);
        if (!existingArtist) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.deleteArtistFromDB)(artistInput);
        res.status(200).json({
            status: 200,
            data: null,
            message: `Artist:${existingArtist === null || existingArtist === void 0 ? void 0 : existingArtist.name} created successfully.`,
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while creating the Artist.',
            error: error.stack,
        });
    }
};
exports.deleteArtist = deleteArtist;
//# sourceMappingURL=artistService.js.map