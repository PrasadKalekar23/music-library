import { getDbConnection } from "../DBConnection";
import * as sql from 'mssql';
import { User } from "../models/userModel";
import { config } from "../config/config";
import { Artist } from "../models/artistModel";
import { Album } from "../models/alhumModel";
import { Track } from "../models/trackModel";
import { Favorite } from "../models/favoritesModel";

export async function checkExistingUser(user: User): Promise<sql.recordSet> {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        let userCheckQuery = ``;

        if(user?.id){
            userCheckQuery = `SELECT * FROM Users WHERE user_id = '${user.id}'`
        }
        if(!user?.id && user?.email){
            userCheckQuery = `SELECT * FROM Users WHERE email = '${user.email}'`
        }

        const sqlResponse = await pool.request().query(userCheckQuery);

        const recordSet = sqlResponse.recordset;
        if(recordSet.length) 
            return recordSet;
        else 
            return undefined;
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function createNewUser(user: User) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        if(!user?.role){
            user.role = config.default_user_role;
        }

        const addUserQuery = `insert into Users(email, password, role) values('${user?.email}', '${user?.password}', '${user?.role}')`;

        await pool.request().query(addUserQuery);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function getUsersFromDB(limit, offset, role) : Promise<sql.recordSet> {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        let query = `SELECT user_id, email, role FROM Users`;
        if (role) {
            query += ` WHERE role = '${role}'`;
        }
        query += ` ORDER BY user_id OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

        const users = await request.query(query);
        return users.recordset;
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function deleteUserFromDB(user: User) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        const query = `delete from Users where user_id = '${user.id}'`;

        await request.query(query);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function updateUserPasswordInDb(user: User){
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        const query = `update Users set Password = '${user.password}' where user_id = '${user.id}'`;

        await request.query(query);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function geArtistsFromDB(limit, offset, grammy, hidden) : Promise<sql.recordSet> {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        let query = `SELECT * FROM Artists WHERE 1=1`;
        if (grammy !== undefined) {
            query += ` and grammy = ${grammy}`;
        }
        if (hidden !== undefined) {
            query += `and hidden = ${hidden == 'true' ? 1 : 0}`;
        }
        query += ` ORDER BY artist_id OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

        const artists = await request.query(query);
        return artists.recordset;
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function getExtistingArtist(artist: Artist): Promise<sql.recordSet> {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        let artistCheckQuery = ``;

        const request = pool.request();

        if(artist?.artist_id){
            request.input('ArtistId', artist.artist_id);
            artistCheckQuery = `SELECT * FROM Artists WHERE artist_id = @ArtistId`
        }
        if(!artist?.artist_id && artist?.name){
            request.input('name', artist.name);
            artistCheckQuery = `SELECT * FROM Artists WHERE name = @name`
        }

        const sqlResponse = await request.query(artistCheckQuery);

        const recordSet = sqlResponse.recordset;
        if(recordSet.length) 
            return recordSet;
        else 
            return undefined;
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function addNewArtist(artist: Artist) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        const artistInsertQuery = `insert into Artists(name, grammy, hidden) values('${artist?.name}', ${artist?.grammy}, ${artist?.hidden ? 1 : 0})`;

        await pool.request().query(artistInsertQuery);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function updateArtistInDB(artist: Artist) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        let artistUpdateQuery = `update Artists set `;
        const updates: string[] = [];

        if(artist?.name){
            updates.push(`name = '${artist?.name}'`);
        }
        if(artist?.grammy){
            updates.push(`grammy = ${artist?.grammy}`);
        }
        if(artist?.hidden){
            updates.push(`hidden = ${artist?.hidden ? 1 : 0}`);
        }

        artistUpdateQuery += updates.join(', ');
        artistUpdateQuery += ` WHERE artist_id = '${artist?.artist_id}'`;

        await pool.request().query(artistUpdateQuery);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}


export async function deleteArtistFromDB(artist: Artist) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        const query = `delete from Artists where artist_id = '${artist.artist_id}'`;

        await request.query(query);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function geAlbumsFromDB(limit, offset, artist_id, hidden) : Promise<sql.recordSet> {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        let query = `SELECT album.album_id, artist.name as artist_name, album.name, album.year, album.hidden FROM Albums album join `+
                `Artists artist on artist.artist_id = album.artist_id WHERE 1=1`;
        if (artist_id !== undefined) {
            query += ` and album.artist_id = '${artist_id}'`;
        }
        if (hidden !== undefined) {
            query += `and hidden = ${hidden == 'true' ? 1 : 0}`;
        }
        query += ` ORDER BY album_id OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

        const artists = await request.query(query);
        return artists.recordset;
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function getExistingAlbum(album: Album): Promise<sql.recordSet> {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        let albumCheckQuery = ``;

        const request = pool.request();

        if(album?.album_id){
            request.input('AlbumId', album.album_id);
            albumCheckQuery = `SELECT album.album_id, artist.name as artist_name, album.name, album.year, album.hidden FROM Albums album join `+
                `Artists artist on artist.artist_id = album.artist_id WHERE album.album_id = @AlbumId`
        }
        if(!album?.album_id && album?.name){
            request.input('name', album.name);
            albumCheckQuery = `SELECT album.album_id, artist.name as artist_name, album.name, album.year, album.hidden FROM Albums album join `+
                `Artists artist on artist.artist_id = album.artist_id WHERE album.name = @name`
        }

        const sqlResponse = await request.query(albumCheckQuery);

        const recordSet = sqlResponse.recordset;
        if(recordSet.length) 
            return recordSet;
        else 
            return undefined;
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function addNewAlbum(album: Album) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        const albumInsertQuery = `insert into Albums(artist_id, name, year, hidden) values('${album?.artist_id}', '${album?.name}', ${album?.year}, ${album?.hidden ? 1 : 0})`;

        await pool.request().query(albumInsertQuery);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function updateAlbumInDB(album: Album) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        let albumUpdateQuery = `update Albums set `;
        const updates: string[] = [];

        if(album?.name){
            updates.push(`name = '${album?.name}'`);
        }
        if(album?.year){
            updates.push(`year = ${album?.year}`);
        }
        if(album?.hidden){
            updates.push(`hidden = ${album?.hidden ? 1 : 0}`);
        }

        albumUpdateQuery += updates.join(', ');
        albumUpdateQuery += ` WHERE album_id = '${album?.album_id}'`;

        await pool.request().query(albumUpdateQuery);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function deleteAlbumFromDB(album: Album) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        const query = `delete from Albums where album_id = '${album.album_id}'`;

        await request.query(query);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function geTracksFromDB(limit, offset, artist_id, album_id, hidden) : Promise<sql.recordSet> {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        let query = `SELECT track.track_id, album.name as album_name, artist.name as artist_name, track.name, track.duration, track.hidden FROM Tracks track`+
                ` join Albums album on album.album_id = track.album_id`+
                ` join Artists artist on artist.artist_id = track.artist_id WHERE 1=1`;
        if (artist_id !== undefined) {
            query += ` and track.artist_id = '${artist_id}'`;
        }
        if (album_id !== undefined) {
            query += ` and track.album_id = '${album_id}'`;
        }
        if (hidden !== undefined) {
            query += `and hidden = ${hidden == 'true' ? 1 : 0}`;
        }
        query += ` ORDER BY track.track_id OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

        const artists = await request.query(query);
        return artists.recordset;
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function getExistingTrack(track: Track): Promise<sql.recordSet> {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        let trackCheckQuery = ``;

        const request = pool.request();

        if(track?.track_id){
            request.input('TrackId', track.track_id);
            trackCheckQuery = `SELECT track.track_id, album.name as album_name, artist.name as artist_name, track.name, track.duration, track.hidden FROM Tracks track`+
                ` join Albums album on album.album_id = track.album_id`+
                ` join Artists artist on artist.artist_id = track.artist_id WHERE track.track_id = @TrackId`
        }
        if(!track?.track_id && track?.name){
            request.input('name', track.name);
            trackCheckQuery = `SELECT track.track_id, album.name as album_name, artist.name as artist_name, track.name, track.duration, track.hidden FROM Tracks track`+
                ` join Albums album on album.album_id = track.album_id`+
                ` join Artists artist on artist.artist_id = track.artist_id WHERE track.name = @name`
        }

        const sqlResponse = await request.query(trackCheckQuery);

        const recordSet = sqlResponse.recordset;
        if(recordSet.length) 
            return recordSet;
        else 
            return undefined;
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function addNewTrack(track: Track) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        const trackInsertQuery = `insert into Tracks(album_id, artist_id, name, duration, hidden) values('${track?.album_id}', '${track?.artist_id}', '${track?.name}', ${track?.duration}, ${track?.hidden ? 1 : 0})`;

        await pool.request().query(trackInsertQuery);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function updateTrackInDB(track: Track) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        let trackUpdateQuery = `update Tracks set `;
        const updates: string[] = [];

        if(track?.name){
            updates.push(`name = '${track?.name}'`);
        }
        if(track?.duration){
            updates.push(`duration = ${track?.duration}`);
        }
        if(track?.hidden){
            updates.push(`hidden = ${track?.hidden ? 1 : 0}`);
        }

        trackUpdateQuery += updates.join(', ');
        trackUpdateQuery += ` WHERE track_id = '${track?.track_id}'`;

        await pool.request().query(trackUpdateQuery);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function deleteTrackFromDB(track: Track) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        const query = `delete from Tracks where track_id = '${track.track_id}'`;

        await request.query(query);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function getFavoritesFromDB(limit, offset, user_id, category) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        const select_clause = `SELECT f.favorite_id, f.category, f.item_id, a.name, created_at FROM Favorites f `
        let join_clause = ``;
        if (category === 'artist') {
            join_clause = `join Artists a on f.item_id = a.artist_id`;
        } else if (category === 'album') {
            join_clause = `join ALbums a on f.item_id = a.album_id`;
        } else if (category === 'track') {
            join_clause = `join Tracks a on f.item_id = a.track_id`;
        }

        const where_clause =  ` WHERE user_id = '${user_id}' AND category = '${category}' ORDER BY created_at OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

        const query = select_clause + join_clause + where_clause;

        const sqlResponse = await request.query(query);

        const recordSet = sqlResponse.recordset;
        if(recordSet.length) 
            return recordSet;
        else 
            return undefined;
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function checkItemIdExitsts(favorite: Favorite) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();

        let resourceQuery = '';
        if(favorite?.favorite_id){
            resourceQuery = `SELECT * FROM Favorites WHERE favorite_id = '${favorite?.favorite_id}'`
        } else if (favorite?.category === 'artist') {
            resourceQuery = `SELECT artist_id FROM Artists WHERE artist_id = '${favorite?.item_id}'`;
        } else if (favorite?.category === 'album') {
            resourceQuery = `SELECT album_id FROM Albums WHERE album_id = '${favorite?.item_id}'`;
        } else if (favorite?.category === 'track') {
            resourceQuery = `SELECT track_id FROM Tracks WHERE track_id = '${favorite?.item_id}'`;
        }

        const resourceExists = await request.query(resourceQuery);

        if(resourceExists.recordset.length !== 0) return true;
        else return false;
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function createNewFavorite(favorite: Favorite) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();

        const addUserQuery = `insert into Favorites(user_id, category, item_id) values('${favorite?.uesr_id}', '${favorite?.category}', '${favorite?.item_id}')`;

        await pool.request().query(addUserQuery);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}

export async function deleteFavoriteFromDB(favorite: Favorite) {
    try{
        const pool: sql.ConnectionPool = await getDbConnection();
        const request = pool.request();
        const query = `delete from Favorites where favorite_id = '${favorite.favorite_id}'`;

        await request.query(query);
    }
    catch(error){
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}