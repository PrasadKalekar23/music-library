"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userService_1 = require("../services/userService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
// import { sign } from "jsonwebtoken";
// import { config } from "../config/config";
const userRoutes = express_1.default.Router();
userRoutes.post('/signup', userService_1.signup);
userRoutes.post('/login', userService_1.login);
userRoutes.get('/users', authMiddleware_1.authenticateToken, userService_1.getUsers);
userRoutes.post('/users/add-user', authMiddleware_1.authenticateToken, userService_1.addUser);
userRoutes.delete('/users/:user_id', authMiddleware_1.authenticateToken, userService_1.deleteUser);
userRoutes.put('/users/update-password', authMiddleware_1.authenticateToken, userService_1.updatePassword);
exports.default = userRoutes;
//# sourceMappingURL=userRoutes.js.map