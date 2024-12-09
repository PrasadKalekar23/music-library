"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trackService_1 = require("../services/trackService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const trackRoutes = express_1.default.Router();
trackRoutes.get('/tracks', authMiddleware_1.authenticateToken, trackService_1.getTracks);
trackRoutes.post('/tracks/add-track', authMiddleware_1.authenticateToken, trackService_1.addTrack);
trackRoutes.get('/tracks/:track_id', authMiddleware_1.authenticateToken, trackService_1.gettrackBytrackId);
trackRoutes.put('/tracks/:track_id', authMiddleware_1.authenticateToken, trackService_1.updateTrack);
trackRoutes.delete('/tracks/:track_id', authMiddleware_1.authenticateToken, trackService_1.deleteTrack);
exports.default = trackRoutes;
//# sourceMappingURL=tracksRoutes.js.map