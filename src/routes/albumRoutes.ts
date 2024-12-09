import express from "express";
import { getAlbums, getAlbumByAlbumId, addAlbum, updateAlbum, deleteAlbum } from "../services/albumService";
import { authenticateToken } from "../middlewares/authMiddleware";

const albumRoutes = express.Router();

albumRoutes.get('/albums', authenticateToken, getAlbums);
albumRoutes.post('/albums/add-album', authenticateToken, addAlbum);
albumRoutes.get('/albums/:album_id', authenticateToken, getAlbumByAlbumId);
albumRoutes.put('/albums/:album_id', authenticateToken, updateAlbum);
albumRoutes.delete('/albums/:album_id', authenticateToken, deleteAlbum);


export default albumRoutes;