"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.deleteUser = exports.addUser = exports.getUsers = exports.login = exports.signup = void 0;
const musicLibrarySQLDataStore_1 = require("../dataStores/musicLibrarySQLDataStore");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const signup = async (req, res) => {
    const userSignupRequestBody = req.body;
    if (!userSignupRequestBody.email || !userSignupRequestBody.password) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: email and password must be provided.',
            error: null,
        });
        return;
    }
    try {
        const existingUser = await (0, musicLibrarySQLDataStore_1.checkExistingUser)(userSignupRequestBody);
        if (existingUser) {
            res.status(409).json({
                status: 409,
                data: null,
                message: 'Email already exists.',
                error: null,
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(userSignupRequestBody.password, 10);
        userSignupRequestBody.password = hashedPassword;
        await (0, musicLibrarySQLDataStore_1.createNewUser)(userSignupRequestBody);
        res.status(201).json({
            status: 201,
            data: null,
            message: 'User created successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while processing your request.',
            error: error.stack,
        });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const userSignupRequestBody = req.body;
    if (!userSignupRequestBody.email || !userSignupRequestBody.password) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: email and password must be provided.',
            error: null,
        });
        return;
    }
    try {
        const existingUser = await (0, musicLibrarySQLDataStore_1.checkExistingUser)(userSignupRequestBody);
        if (!existingUser) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
            return;
        }
        const validPassword = await bcryptjs_1.default.compare(userSignupRequestBody.password, existingUser[0].password);
        if (!validPassword) {
            res.status(400).json({
                status: 400,
                data: null,
                message: 'Invalid credentials.',
                error: null,
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: existingUser[0].user_id, role: existingUser[0].role }, config_1.config.jwt_sercet, { expiresIn: '10h' });
        res.status(200).json({
            status: 200,
            data: { token },
            message: 'Login successful.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while processing your request.',
            error: error.stack,
        });
    }
};
exports.login = login;
const getUsers = async (req, res) => {
    var _a;
    const { limit = 5, offset = 0, role } = req.query;
    //console.log(req);
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Admin') {
        res.status(401).json({
            status: 401,
            data: null,
            message: 'Unauthorized Access',
            error: null,
        });
        return;
    }
    try {
        const users = await (0, musicLibrarySQLDataStore_1.getUsersFromDB)(limit, offset, role);
        res.status(200).json({
            status: 200,
            data: users,
            message: 'Users retrieved successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching users.',
            error: error.stack,
        });
    }
};
exports.getUsers = getUsers;
const addUser = async (req, res) => {
    var _a;
    const userInput = req.body;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Admin') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }
    if (!(userInput === null || userInput === void 0 ? void 0 : userInput.email) || !(userInput === null || userInput === void 0 ? void 0 : userInput.password) || !(userInput === null || userInput === void 0 ? void 0 : userInput.role)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: email, password and role all fields are mandatory.',
            error: null,
        });
        return;
    }
    if (!['Editor', 'Viewer'].includes(userInput === null || userInput === void 0 ? void 0 : userInput.role)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Admin user cannot be added.',
            error: null,
        });
        return;
    }
    try {
        const existingUser = await (0, musicLibrarySQLDataStore_1.checkExistingUser)(userInput);
        if (existingUser) {
            res.status(409).json({
                status: 409,
                data: null,
                message: 'Email already exists.',
                error: null,
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(userInput === null || userInput === void 0 ? void 0 : userInput.password, 10);
        userInput.password = hashedPassword;
        await (0, musicLibrarySQLDataStore_1.createNewUser)(userInput);
        res.status(201).json({
            status: 201,
            data: null,
            message: 'User created successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while creating the user.',
            error: error.stack,
        });
    }
};
exports.addUser = addUser;
const deleteUser = async (req, res) => {
    var _a;
    const { user_id } = req.params;
    const userInput = { id: user_id };
    if (!(0, uuid_1.validate)(userInput === null || userInput === void 0 ? void 0 : userInput.id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid User ID format',
            error: null,
        });
        return;
    }
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Admin') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }
    try {
        const existingUser = await (0, musicLibrarySQLDataStore_1.checkExistingUser)(userInput);
        if (!existingUser) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
            return;
        }
        await (0, musicLibrarySQLDataStore_1.deleteUserFromDB)(userInput);
        res.status(200).json({
            status: 200,
            data: null,
            message: 'User deleted successfully.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while deleting the user.',
            error: error.stack,
        });
    }
};
exports.deleteUser = deleteUser;
const updatePassword = async (req, res) => {
    var _a;
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: old and new Both password are required.',
            error: null,
        });
        return;
    }
    try {
        const user = { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId };
        const existingUser = await (0, musicLibrarySQLDataStore_1.checkExistingUser)(user);
        if (!existingUser) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
            return;
        }
        const validPassword = await bcryptjs_1.default.compare(old_password, existingUser[0].password);
        if (!validPassword) {
            res.status(400).json({
                status: 400,
                data: null,
                message: 'Invalid credentials.',
                error: null,
            });
            return;
        }
        user.password = await bcryptjs_1.default.hash(new_password, 10);
        await (0, musicLibrarySQLDataStore_1.updateUserPasswordInDb)(user);
        res.status(204).json({
            status: 204,
            data: null,
            message: 'Password Updated.',
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while deleting the user.',
            error: error.stack,
        });
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=userService.js.map