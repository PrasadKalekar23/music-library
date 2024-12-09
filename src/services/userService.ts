import { checkExistingUser, createNewUser, getUsersFromDB, deleteUserFromDB, updateUserPasswordInDb } from "../dataStores/musicLibrarySQLDataStore"
import { User } from "../models/userModel"
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { config } from "../config/config";
import jwt from 'jsonwebtoken';
import { validate as isUUID } from 'uuid';


export const signup = async (req: Request, res: Response): Promise<void> => {
    const userSignupRequestBody: User = req.body;

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
        const existingUser = await checkExistingUser(userSignupRequestBody);

        if (existingUser) {
            res.status(409).json({
                status: 409,
                data: null,
                message: 'Email already exists.',
                error: null,
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(userSignupRequestBody.password, 10);
        userSignupRequestBody.password = hashedPassword

        await createNewUser(userSignupRequestBody);

        res.status(201).json({
            status: 201,
            data: null,
            message: 'User created successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while processing your request.',
            error: error.stack,
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const userSignupRequestBody: User = req.body;

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
        const existingUser = await checkExistingUser(userSignupRequestBody);

        if (!existingUser) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
            return;
        }

        const validPassword = await bcrypt.compare(userSignupRequestBody.password, existingUser[0].password);
        if (!validPassword) {
            res.status(400).json({
                status: 400,
                data: null,
                message: 'Invalid credentials.',
                error: null,
            });
            return;
        }

        const token = jwt.sign(
            { userId: existingUser[0].user_id, role: existingUser[0].role },
            config.jwt_sercet!,
            { expiresIn: '10h' }
        );

        res.status(200).json({
            status: 200,
            data: { token },
            message: 'Login successful.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while processing your request.',
            error: error.stack,
        });
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const { limit = 5, offset = 0, role } = req.query;
    //console.log(req);

    if (req.user?.role !== 'Admin') {
        res.status(401).json({
            status: 401,
            data: null,
            message: 'Unauthorized Access',
            error: null,
        });
        return;
    }

    try {
        const users = await getUsersFromDB(limit, offset, role);

        res.status(200).json({
            status: 200,
            data: users,
            message: 'Users retrieved successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching users.',
            error: error.stack,
        });
    }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
    const userInput: User = req.body;

    if (req.user?.role !== 'Admin') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }

    if (!userInput?.email || !userInput?.password || !userInput?.role) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: email, password and role all fields are mandatory.',
            error: null,
        });
        return;
    }

    if (!['Editor', 'Viewer'].includes(userInput?.role)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Admin user cannot be added.',
            error: null,
        });
        return;
    }

    try {
        const existingUser = await checkExistingUser(userInput);

        if (existingUser) {
            res.status(409).json({
                status: 409,
                data: null,
                message: 'Email already exists.',
                error: null,
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(userInput?.password, 10);
        userInput.password = hashedPassword;

        await createNewUser(userInput);

        res.status(201).json({
            status: 201,
            data: null,
            message: 'User created successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while creating the user.',
            error: error.stack,
        });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;
    const userInput: User = {id: user_id};

    if (!isUUID(userInput?.id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid User ID format',
            error: null,
        });
        return;
    }

    if (req.user?.role !== 'Admin') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }

    try {
        const existingUser = await checkExistingUser(userInput);

        if (!existingUser) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
            return;
        }

       
        await deleteUserFromDB(userInput);

        res.status(200).json({
            status: 200,
            data: null,
            message: 'User deleted successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while deleting the user.',
            error: error.stack,
        });
    }
};

export const updatePassword = async(req: Request, res: Response): Promise<void> => {
    const {old_password, new_password} = req.body;

    if (!old_password || !new_password) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: old and new Both password are required.',
            error: null,
        });
        return;
    }

    try{
        const user: User = {id: req.user?.userId };

        const existingUser = await checkExistingUser(user);

        if (!existingUser) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
            return;
        }

        const validPassword = await bcrypt.compare(old_password, existingUser[0].password);
        if (!validPassword) {
            res.status(400).json({
                status: 400,
                data: null,
                message: 'Invalid credentials.',
                error: null,
            });
            return;
        }
        
        user.password = await bcrypt.hash(new_password, 10);
        await updateUserPasswordInDb(user);

        res.status(204).json({
            status: 204,
            data: null,
            message: 'Password Updated.',
            error: null,
        });

    }  catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while deleting the user.',
            error: error.stack,
        });
    }


}
