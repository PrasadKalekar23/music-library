import { Request, Response } from 'express';
import { geArtistsFromDB, getExtistingArtist, addNewArtist, updateArtistInDB, deleteArtistFromDB } from "../dataStores/musicLibrarySQLDataStore";
import { Artist } from '../models/artistModel';
import { validate as isUUID } from 'uuid';

export const getArtists =  async (req: Request, res: Response): Promise<void> => {
    const { limit = 5, offset = 0, grammy, hidden} = req.query;

    try {
        const artists = await geArtistsFromDB(limit, offset, grammy, hidden);

        res.status(200).json({
            status: 200,
            data: artists,
            message: 'Artists retrieved successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching Artists.',
            error: error.stack,
        });
    }
};

export const getArtistByArtistId = async (req: Request, res: Response): Promise<void> => {
    const { artist_id } = req.params;
    const artist_input: Artist = {artist_id: artist_id};

    if (!isUUID(artist_input?.artist_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Artist ID format',
            error: null,
        });
        return;
    }

    try{
        const artist = await getExtistingArtist(artist_input);

        if(!artist){
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null,
            });
            return;
        }
        res.status(200).json({
            status: 200,
            data: artist[0],
            message: 'Artist retrieved successfully.',
            error: null,
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching Artist.',
            error: error.stack,
        });
    }
}

export const addArtist = async (req: Request, res: Response): Promise<void> => {
    const artistInput: Artist = req.body;

    if (req.user?.role !== 'Admin' && req.user?.role !== 'Editor') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }

    if (!artistInput?.name || artistInput?.grammy === undefined || artistInput?.hidden === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: name, grammy, hidden all fields are mandatory.',
            error: null,
        });
        return;
    }

    try {
        const existingUser = await getExtistingArtist(artistInput);

        if (existingUser) {
            res.status(409).json({
                status: 409,
                data: null,
                message: 'Artist already exists.',
                error: null,
            });
            return;
        }

        await addNewArtist(artistInput);

        res.status(201).json({
            status: 201,
            data: null,
            message: 'Artist created successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while adding the Artist.',
            error: error.stack,
        });
    }
};

export const updateArtist = async (req: Request, res: Response): Promise<void> => {
    const artistInput: Artist = req.body;
    const { artist_id } = req.params;
    artistInput.artist_id = artist_id;

    if (!isUUID(artistInput?.artist_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Artist ID format',
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

    if (!artistInput?.name && artistInput?.grammy === undefined && artistInput?.hidden === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: No fields to Update',
            error: null,
        });
        return;
    }

    try {
        const existingUser = await getExtistingArtist(artistInput);

        if (!existingUser) {
            res.status(409).json({
                status: 409,
                data: null,
                message: 'Artist not found',
                error: null,
            });
            return;
        }

        await updateArtistInDB(artistInput);

        res.status(204).json({
            status: 204,
            data: null,
            message: 'Artist created successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while updating the Artist.',
            error: error.stack,
        });
    }
};

export const deleteArtist = async (req: Request, res: Response): Promise<void> => {
    const { artist_id } = req.params;
    const artistInput: Artist = {artist_id: artist_id};

    if (!isUUID(artistInput?.artist_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Artist ID format',
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
        const existingArtist = await getExtistingArtist(artistInput);

        if (!existingArtist) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found',
                error: null,
            });
            return;
        }

        await deleteArtistFromDB(artistInput);

        res.status(200).json({
            status: 200,
            data: null,
            message: `Artist:${existingArtist?.name} created successfully.`,
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while creating the Artist.',
            error: error.stack,
        });
    }
};