"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlbum = exports.updateAlbum = exports.addAlbum = exports.getAlbumByAlbumId = exports.getAlbums = void 0;
const musicLibrarySQLDataStore_1 = require("../dataStores/musicLibrarySQLDataStore");
const uuid_1 = require("uuid");
const getAlbums = async (req, res) => {
    const { limit = 5, offset = 0, artist_id, hidden } = req.query;
    if (artist_id !== undefined && !(0, uuid_1.validate)(artist_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Album ID format',
            error: null,
        });
        return;
    }
    try {
        const artists = await (0, musicLibrarySQLDataStore_1.geAlbumsFromDB)(limit, offset, artist_id, hidden);
        res.status(200).json({
            status: 200,
            data: artists,
            message: 'Albums retrieved successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching Albums.',
            error: error.stack,
        });
    }
};
exports.getAlbums = getAlbums;
const getAlbumByAlbumId = async (req, res) => {
    const { album_id } = req.params;
    const album_input = { album_id: album_id };
    if (!(0, uuid_1.validate)(album_input === null || album_input === void 0 ? void 0 : album_input.album_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Album ID format',
            error: null,
        });
        return;
    }
    try {
        const album = await (0, musicLibrarySQLDataStore_1.getExistingAlbum)(album_input);
        if (!album) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found.',
                error: null,
            });
            return;
        }
        res.status(200).json({
            status: 200,
            data: album[0],
            message: "Albums retrieved successfully.",
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching Album.',
            error: error.stack,
        });
    }
};
exports.getAlbumByAlbumId = getAlbumByAlbumId;
const addAlbum = async (req, res) => {
    var _a, _b;
    const albumInput = req.body;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Admin' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'Editor') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }
    if (!(albumInput === null || albumInput === void 0 ? void 0 : albumInput.artist_id) || !(albumInput === null || albumInput === void 0 ? void 0 : albumInput.name) || (albumInput === null || albumInput === void 0 ? void 0 : albumInput.year) === undefined || (albumInput === null || albumInput === void 0 ? void 0 : albumInput.hidden) === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: artist_id, name, year, hidden all fields are mandatory.',
            error: null,
        });
        return;
    }
    try {
        const getArtist = await (0, musicLibrarySQLDataStore_1.getExtistingArtist)({ artist_id: albumInput.artist_id });
        if (!getArtist) {
            await res.status(404).json({
                status: 303,
                data: null,
                message: 'Artist not found.',
                error: null,
            });
        }
        const existingAlbum = await (0, musicLibrarySQLDataStore_1.getExistingAlbum)(albumInput);
        if (existingAlbum) {
            await res.status(409).json({
                status: 409,
                data: null,
                message: 'Album already exists.',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.addNewAlbum)(albumInput);
        res.status(201).json({
            status: 201,
            data: null,
            message: 'Album created successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while adding the Album.',
            error: error.stack,
        });
    }
};
exports.addAlbum = addAlbum;
const updateAlbum = async (req, res) => {
    var _a, _b;
    const albumInput = req.body;
    const { album_id } = req.params;
    albumInput.album_id = album_id;
    if (!(0, uuid_1.validate)(albumInput === null || albumInput === void 0 ? void 0 : albumInput.album_id)) {
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
    if (!(albumInput === null || albumInput === void 0 ? void 0 : albumInput.name) && (albumInput === null || albumInput === void 0 ? void 0 : albumInput.year) === undefined && (albumInput === null || albumInput === void 0 ? void 0 : albumInput.hidden) === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: No fields to Update',
            error: null,
        });
        return;
    }
    try {
        const existingAlbum = await (0, musicLibrarySQLDataStore_1.getExistingAlbum)(albumInput);
        if (!existingAlbum) {
            await res.status(404).json({
                status: 404,
                data: null,
                message: 'Album does not exists',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.updateAlbumInDB)(albumInput);
        res.status(204).json({
            status: 204,
            data: null,
            message: 'Album updated successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while updating the Album.',
            error: error.stack,
        });
    }
};
exports.updateAlbum = updateAlbum;
const deleteAlbum = async (req, res) => {
    var _a, _b, _c;
    const { album_id } = req.params;
    const albumInput = { album_id: album_id };
    if (!(0, uuid_1.validate)(albumInput === null || albumInput === void 0 ? void 0 : albumInput.album_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Album ID format',
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
        const existingAlbum = await (0, musicLibrarySQLDataStore_1.getExistingAlbum)(albumInput);
        if (!existingAlbum) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.deleteAlbumFromDB)(albumInput);
        res.status(200).json({
            status: 200,
            data: null,
            message: `Album:${(_c = existingAlbum[0]) === null || _c === void 0 ? void 0 : _c.name} deleted successfully.`,
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while Deleting the Album.',
            error: error.stack,
        });
    }
};
exports.deleteAlbum = deleteAlbum;
//# sourceMappingURL=albumService.js.map