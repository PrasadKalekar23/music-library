"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userService_1 = require("./userService");
// import { sign } from "jsonwebtoken";
// import { config } from "../config/config";
const userRoutes = express_1.default.Router();
userRoutes.post('/signup', userService_1.signup);
exports.default = userRoutes;
//# sourceMappingURL=userRoutes.js.map