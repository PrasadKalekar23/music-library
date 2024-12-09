"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const expenseTrackerSQLDataStore_1 = require("../dataStores/expenseTrackerSQLDataStore");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config/config");
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
        const existingUser = await (0, expenseTrackerSQLDataStore_1.checkExistingUser)('SELECT email FROM Users WHERE email = @Email');
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
        await (0, expenseTrackerSQLDataStore_1.createNewUser)(userSignupRequestBody.email, hashedPassword, config_1.config.default_user_role);
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
//# sourceMappingURL=userService.js.map