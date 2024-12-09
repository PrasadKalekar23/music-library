import express from "express";
import { getArtists, getArtistByArtistId, addArtist, updateArtist, deleteArtist } from "../services/artistService";
import { authenticateToken } from "../middlewares/authMiddleware";
// import { sign } from "jsonwebtoken";
// import { config } from "../config/config";

const artistRoutes = express.Router();
;
artistRoutes.get('/artists', authenticateToken, getArtists);
artistRoutes.post('/artists/add-artist', authenticateToken, addArtist);
artistRoutes.get('/artists/:artist_id', authenticateToken, getArtistByArtistId);
artistRoutes.put('/artists/:artist_id', authenticateToken, updateArtist);
artistRoutes.delete('/artists/:artist_id', authenticateToken, deleteArtist);


export default artistRoutes;