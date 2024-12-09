"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const artistService_1 = require("../services/artistService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
// import { sign } from "jsonwebtoken";
// import { config } from "../config/config";
const artistRoutes = express_1.default.Router();
;
artistRoutes.get('/artists', authMiddleware_1.authenticateToken, artistService_1.getArtists);
artistRoutes.post('/artists/add-artist', authMiddleware_1.authenticateToken, artistService_1.addArtist);
artistRoutes.get('/artists/:artist_id', authMiddleware_1.authenticateToken, artistService_1.getArtistByArtistId);
artistRoutes.put('/artists/:artist_id', authMiddleware_1.authenticateToken, artistService_1.updateArtist);
artistRoutes.delete('/artists/:artist_id', authMiddleware_1.authenticateToken, artistService_1.deleteArtist);
exports.default = artistRoutes;
//# sourceMappingURL=artistsRoutes.js.map