"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const favoriteService_1 = require("../services/favoriteService");
const favoriteRoutes = express_1.default.Router();
favoriteRoutes.get('/favorites/:category', authMiddleware_1.authenticateToken, favoriteService_1.getFavorites);
favoriteRoutes.post('/favorites/add-favorite', authMiddleware_1.authenticateToken, favoriteService_1.addFavorite);
favoriteRoutes.delete('/favorites/:favorite_id', authMiddleware_1.authenticateToken, favoriteService_1.deleteFavorite);
exports.default = favoriteRoutes;
//# sourceMappingURL=favoritesRoutes.js.map