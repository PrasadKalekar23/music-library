import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { addFavorite, deleteFavorite, getFavorites } from "../services/favoriteService";

const favoriteRoutes = express.Router();

favoriteRoutes.get('/favorites/:category', authenticateToken, getFavorites);
favoriteRoutes.post('/favorites/add-favorite', authenticateToken, addFavorite);
favoriteRoutes.delete('/favorites/:favorite_id', authenticateToken, deleteFavorite);


export default favoriteRoutes;