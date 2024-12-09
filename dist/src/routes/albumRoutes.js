"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const albumService_1 = require("../services/albumService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const albumRoutes = express_1.default.Router();
albumRoutes.get('/albums', authMiddleware_1.authenticateToken, albumService_1.getAlbums);
albumRoutes.post('/albums/add-album', authMiddleware_1.authenticateToken, albumService_1.addAlbum);
albumRoutes.get('/albums/:album_id', authMiddleware_1.authenticateToken, albumService_1.getAlbumByAlbumId);
albumRoutes.put('/albums/:album_id', authMiddleware_1.authenticateToken, albumService_1.updateAlbum);
albumRoutes.delete('/albums/:album_id', authMiddleware_1.authenticateToken, albumService_1.deleteAlbum);
exports.default = albumRoutes;
//# sourceMappingURL=albumRoutes.js.map