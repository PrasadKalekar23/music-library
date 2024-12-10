import { Request, Response } from 'express';
import { geTracksFromDB, getExistingAlbum, getExtistingArtist, getExistingTrack, addNewTrack, updateTrackInDB, deleteTrackFromDB } from "../dataStores/musicLibrarySQLDataStore";
import { Track } from '../models/trackModel';
import { validate as isUUID } from 'uuid';

export const getTracks =  async (req: Request, res: Response): Promise<void> => {
    const { limit = 5, offset = 0, artist_id, album_id, hidden} = req.query;

    if (artist_id!== undefined && !isUUID(artist_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid arist_id format',
            error: null,
        });
        return;
    }

    if (album_id!== undefined && !isUUID(album_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid album_id format',
            error: null,
        });
        return;
    }


    try {
        const artists = await geTracksFromDB(limit, offset, artist_id, album_id, hidden);

        res.status(200).json({
            status: 200,
            data: artists,
            message: 'Tracks retrieved successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching tracks.',
            error: error.stack,
        });
    }
};

export const gettrackBytrackId = async (req: Request, res: Response): Promise<void> => {
    const { track_id } = req.params;
    const track_input: Track = {track_id: track_id};

    if (!isUUID(track_input?.track_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid track ID format',
            error: null,
        });
        return;
    }

    try{
        const track = await getExistingTrack(track_input);

        if(!track){
            res.status(404).json({
                status: 404,
                data: null,
                message: 'track not found.',
                error: null,
            });
            return;
        }
        res.status(200).json({
            status: 200,
            data: track[0],
            message: "tracks retrieved successfully.",
            error: null,
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while fetching track.',
            error: error.stack,
        });
    }
}

export const addTrack = async (req: Request, res: Response): Promise<void> => {
    const trackInput: Track = req.body;

    if (req.user?.role !== 'Admin' && req.user?.role !== 'Editor') {
        res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
        return;
    }

    if (!trackInput?.album_id || !trackInput?.artist_id || !trackInput?.name || trackInput?.duration === undefined || trackInput?.hidden === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: album_id, artist_id, name, duration, hidden all fields are mandatory.',
            error: null,
        });
        return;
    }

    if (!isUUID(trackInput?.artist_id) || !isUUID(trackInput?.album_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid Artist or Album ID format',
            error: null,
        });
        return;
    }

    try {
        const getArtist = await getExtistingArtist({artist_id: trackInput.artist_id});

        if(!getArtist){
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null,
            });
            return;
        }

        const existingAlbum= await getExistingAlbum({album_id: trackInput.album_id});

        if (!existingAlbum) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not exists.',
                error: null,
            });
            return;
        }

        const existingtrack = await getExistingTrack(trackInput);

        if (existingtrack) {
            res.status(409).json({
                status: 409,
                data: null,
                message: 'Track already exists.',
                error: null,
            });
            return;
        }

        await addNewTrack(trackInput);

        res.status(201).json({
            status: 201,
            data: null,
            message: 'track created successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while adding the track.',
            error: error.stack,
        });
    }
};

export const updateTrack = async (req: Request, res: Response): Promise<void> => {
    const trackInput: Track = req.body;
    const { track_id } = req.params;
    trackInput.track_id = track_id;

    if (!isUUID(trackInput?.track_id)) {
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

    if (!trackInput?.name && trackInput?.duration === undefined && trackInput?.hidden === undefined) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: No fields to Update',
            error: null,
        });
        return;
    }

    try {
        const existingtrack = await getExistingTrack(trackInput);

        if (!existingtrack) {
            await res.status(404).json({
                status: 404,
                data: null,
                message: 'track does not exists',
                error: null,
            });
            return;
        }

        await updateTrackInDB(trackInput);

        res.status(204).json({
            status: 204,
            data: null,
            message: 'track updated successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while updating the track.',
            error: error.stack,
        });
    }
};

export const deleteTrack = async (req: Request, res: Response): Promise<void> => {
    const { track_id } = req.params;
    const trackInput: Track = {track_id: track_id};

    if (!isUUID(trackInput?.track_id)) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request, Reason: Invalid track ID format',
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
        const existingTrack = await getExistingTrack(trackInput);

        if (!existingTrack) {
            res.status(404).json({
                status: 404,
                data: null,
                message: 'track not found',
                error: null,
            });
            return;
        }

        await deleteTrackFromDB(trackInput);

        res.status(200).json({
            status: 200,
            data: null,
            message: `Track:${existingTrack[0]?.name} deleted successfully.`,
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'An error occurred while Deleting the track.',
            error: error.stack,
        });
    }
};