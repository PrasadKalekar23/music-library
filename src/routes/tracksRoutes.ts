import express from "express";
import { getTracks, gettrackBytrackId, addTrack, updateTrack, deleteTrack } from "../services/trackService";
import { authenticateToken } from "../middlewares/authMiddleware";

const trackRoutes = express.Router();

trackRoutes.get('/tracks', authenticateToken, getTracks);
trackRoutes.post('/tracks/add-track', authenticateToken, addTrack);
trackRoutes.get('/tracks/:track_id', authenticateToken, gettrackBytrackId);
trackRoutes.put('/tracks/:track_id', authenticateToken, updateTrack);
trackRoutes.delete('/tracks/:track_id', authenticateToken, deleteTrack);


export default trackRoutes;