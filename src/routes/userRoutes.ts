import express from "express";
import { signup, login, getUsers, addUser, deleteUser, updatePassword } from "../services/userService";
import { authenticateToken } from "../middlewares/authMiddleware";
// import { sign } from "jsonwebtoken";
// import { config } from "../config/config";

const userRoutes = express.Router();

userRoutes.post('/signup', signup);
userRoutes.post('/login', login);
userRoutes.get('/users', authenticateToken, getUsers);
userRoutes.post('/users/add-user', authenticateToken, addUser);
userRoutes.delete('/users/:user_id', authenticateToken, deleteUser);
userRoutes.put('/users/update-password', authenticateToken, updatePassword);

export default userRoutes;