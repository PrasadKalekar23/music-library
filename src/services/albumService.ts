import { Request, Response } from 'express';
import { addNewAlbum, deleteAlbumFromDB, geAlbumsFromDB, getExistingAlbum, getExtistingArtist, updateAlbumInDB } from "../dataStores/musicLibrarySQLDataStore";
import { Album } from '../models/alhumModel';
import { validate as isUUID } from 'uuid';

export const getAlbums =  async (req: Request, res: Response): Promise<void> => {
    const { limit = 5, offset = 0, artist_id, hidden} = req.query;

    if (artist_id!== undefined && !isUUID(artist_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Album ID format',
            error: null,
        });
        return;
    }

    try {
        const artists = await geAlbumsFromDB(limit, offset, artist_id, hidden);

        res.status(200).json({
            status: 200,
            data: artists,
            message: 'Albums retrieved successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching Albums.',
            error: error.stack,
        });
    }
};

export const getAlbumByAlbumId = async (req: Request, res: Response): Promise<void> => {
    const { album_id } = req.params;
    const album_input: Album = {album_id: album_id};

    if (!isUUID(album_input?.album_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Album ID format',
            error: null,
        });
        return;
    }

    try{
        const album = await getExistingAlbum(album_input);

        if(!album){
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found.',
                error: null,
            });
            return;
        }
        res.status(200).json({
            status: 200,
            data: album[0],
            message: "Albums retrieved successfully.",
            error: null,
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching Album.',
            error: error.stack,
        });
    }
}

export const addAlbum = async (req: Request, res: Response): Promise<void> => {
    const albumInput: Album = req.body;

    if (req.user?.role !== 'Admin' && req.user?.role !== 'Editor') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }

    if (!albumInput?.artist_id || !albumInput?.name || albumInput?.year === undefined || albumInput?.hidden === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: artist_id, name, year, hidden all fields are mandatory.',
            error: null,
        });
        return;
    }

    try {
        const getArtist = await getExtistingArtist({artist_id: albumInput.artist_id});

        if(!getArtist){
            await res.status(404).json({
                status: 303,
                data: null,
                message: 'Artist not found.',
                error: null,
            });
        }

        const existingAlbum = await getExistingAlbum(albumInput);

        if (existingAlbum) {
            await res.status(409).json({
                status: 409,
                data: null,
                message: 'Album already exists.',
                error: null,
            });
            return;
        }

        await addNewAlbum(albumInput);

        res.status(201).json({
            status: 201,
            data: null,
            message: 'Album created successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while adding the Album.',
            error: error.stack,
        });
    }
};

export const updateAlbum = async (req: Request, res: Response): Promise<void> => {
    const albumInput: Album = req.body;
    const { album_id } = req.params;
    albumInput.album_id = album_id;

    if (!isUUID(albumInput?.album_id)) {
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

    if (!albumInput?.name && albumInput?.year === undefined && albumInput?.hidden === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: No fields to Update',
            error: null,
        });
        return;
    }

    try {
        const existingAlbum = await getExistingAlbum(albumInput);

        if (!existingAlbum) {
            await res.status(404).json({
                status: 404,
                data: null,
                message: 'Album does not exists',
                error: null,
            });
            return;
        }

        await updateAlbumInDB(albumInput);

        res.status(204).json({
            status: 204,
            data: null,
            message: 'Album updated successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while updating the Album.',
            error: error.stack,
        });
    }
};

export const deleteAlbum = async (req: Request, res: Response): Promise<void> => {
    const { album_id } = req.params;
    const albumInput: Album = {album_id: album_id};

    if (!isUUID(albumInput?.album_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Album ID format',
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
        const existingAlbum = await getExistingAlbum(albumInput);

        if (!existingAlbum) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found',
                error: null,
            });
            return;
        }

        await deleteAlbumFromDB(albumInput);

        res.status(200).json({
            status: 200,
            data: null,
            message: `Album:${existingAlbum[0]?.name} deleted successfully.`,
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while Deleting the Album.',
            error: error.stack,
        });
    }
};