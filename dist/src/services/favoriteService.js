"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFavorite = exports.addFavorite = exports.getFavorites = void 0;
const musicLibrarySQLDataStore_1 = require("../dataStores/musicLibrarySQLDataStore");
const uuid_1 = require("uuid");
const getFavorites = async (req, res) => {
    var _a;
    const { category } = req.params;
    const { limit = 5, offset = 0 } = req.query;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const validCategories = ['artist', 'album', 'track'];
    if (!validCategories.includes(category)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid category.',
            error: null,
        });
        return;
    }
    try {
        const favorites = await (0, musicLibrarySQLDataStore_1.getFavoritesFromDB)(limit, offset, user_id, category);
        res.status(200).json({
            status: 200,
            data: favorites,
            message: 'Favorites retrieved successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching favorites.',
            error: error.stack,
        });
    }
};
exports.getFavorites = getFavorites;
const addFavorite = async (req, res) => {
    var _a;
    const favorite_input = req.body;
    favorite_input.uesr_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const validCategories = ['artist', 'album', 'track'];
    if (!validCategories.includes(favorite_input === null || favorite_input === void 0 ? void 0 : favorite_input.category)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid category.',
            error: null,
        });
        return;
    }
    try {
        const resourceExists = await (0, musicLibrarySQLDataStore_1.checkItemIdExitsts)(favorite_input);
        if (!resourceExists) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Resource not found.',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.createNewFavorite)(favorite_input);
        res.status(201).json({
            status: 201,
            data: null,
            message: 'Favorite added successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while adding the favorite.',
            error: error.stack,
        });
    }
};
exports.addFavorite = addFavorite;
const deleteFavorite = async (req, res) => {
    var _a, _b;
    const { favorite_id } = req.params;
    const favorite_input = { favorite_id: favorite_id };
    if (!(0, uuid_1.validate)(favorite_input === null || favorite_input === void 0 ? void 0 : favorite_input.favorite_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid favorite ID format',
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
        const existingFavorite = await (0, musicLibrarySQLDataStore_1.checkItemIdExitsts)(favorite_input);
        if (!existingFavorite) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Favorite not found',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.deleteFavoriteFromDB)(favorite_input);
        res.status(200).json({
            status: 200,
            data: null,
            message: `Favorite removed successfully.`,
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while Deleting the Favorite.',
            error: error.stack,
        });
    }
};
exports.deleteFavorite = deleteFavorite;
//# sourceMappingURL=favoriteService.js.map