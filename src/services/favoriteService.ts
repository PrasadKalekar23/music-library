import { Request, Response } from 'express';
import { checkItemIdExitsts, createNewFavorite, deleteFavoriteFromDB, getFavoritesFromDB } from "../dataStores/musicLibrarySQLDataStore";
import { validate as isUUID } from 'uuid';
import { Favorite } from '../models/favoritesModel';


export const getFavorites = async (req: Request, res: Response): Promise<void> => {
    const { category } = req.params;
    const { limit = 5, offset = 0 } = req.query;
    const user_id = req.user?.userId;
    const validCategories = ['artist', 'album', 'track'];

    if (!validCategories.includes(category)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid category.',
            error: null,
        });
        return;
    }

    try {
        const favorites = await getFavoritesFromDB(limit, offset, user_id, category);

        res.status(200).json({
            status: 200,
            data: favorites,
            message: 'Favorites retrieved successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching favorites.',
            error: error.stack,
        });
    }
};

export const addFavorite = async (req: Request, res: Response): Promise<void> => {
    const favorite_input: Favorite = req.body;
    favorite_input.uesr_id = req.user?.userId;
    const validCategories = ['artist', 'album', 'track'];

    if (!validCategories.includes(favorite_input?.category)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid category.',
            error: null,
        });
        return;
    }

    try {
        const resourceExists = await checkItemIdExitsts(favorite_input);

        if (!resourceExists) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Resource not found.',
                error: null,
            });
            return;
        }

        await createNewFavorite(favorite_input);

        res.status(201).json({
            status: 201,
            data: null,
            message: 'Favorite added successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while adding the favorite.',
            error: error.stack,
        });
    }
};

export const deleteFavorite = async (req: Request, res: Response): Promise<void> => {
    const { favorite_id } = req.params;
    const favorite_input: Favorite = {favorite_id: favorite_id};

    if (!isUUID(favorite_input?.favorite_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid favorite ID format',
            error: null,
        });
        return;
    }

    if (req.user?.role !== 'Admin' && req.user?.role !== 'Editor') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }

    try {
        const existingFavorite = await checkItemIdExitsts(favorite_input);

        if (!existingFavorite) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Favorite not found',
                error: null,
            });
            return;
        }

        await deleteFavoriteFromDB(favorite_input);

        res.status(200).json({
            status: 200,
            data: null,
            message: `Favorite removed successfully.`,
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while Deleting the Favorite.',
            error: error.stack,
        });
    }
};