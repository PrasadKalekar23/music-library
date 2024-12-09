"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExistingUser = checkExistingUser;
exports.createNewUser = createNewUser;
exports.getUsersFromDB = getUsersFromDB;
exports.deleteUserFromDB = deleteUserFromDB;
exports.updateUserPasswordInDb = updateUserPasswordInDb;
exports.geArtistsFromDB = geArtistsFromDB;
exports.getExtistingArtist = getExtistingArtist;
exports.addNewArtist = addNewArtist;
exports.updateArtistInDB = updateArtistInDB;
exports.deleteArtistFromDB = deleteArtistFromDB;
exports.geAlbumsFromDB = geAlbumsFromDB;
exports.getExistingAlbum = getExistingAlbum;
exports.addNewAlbum = addNewAlbum;
exports.updateAlbumInDB = updateAlbumInDB;
exports.deleteAlbumFromDB = deleteAlbumFromDB;
exports.geTracksFromDB = geTracksFromDB;
exports.getExistingTrack = getExistingTrack;
exports.addNewTrack = addNewTrack;
exports.updateTrackInDB = updateTrackInDB;
exports.deleteTrackFromDB = deleteTrackFromDB;
exports.getFavoritesFromDB = getFavoritesFromDB;
exports.checkItemIdExitsts = checkItemIdExitsts;
exports.createNewFavorite = createNewFavorite;
exports.deleteFavoriteFromDB = deleteFavoriteFromDB;
const DBConnection_1 = require("../DBConnection");
const config_1 = require("../config/config");
async function checkExistingUser(user) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        let userCheckQuery = ``;
        if (user === null || user === void 0 ? void 0 : user.id) {
            userCheckQuery = `SELECT * FROM Users WHERE user_id = '${user.id}'`;
        }
        if (!(user === null || user === void 0 ? void 0 : user.id) && (user === null || user === void 0 ? void 0 : user.email)) {
            userCheckQuery = `SELECT * FROM Users WHERE email = '${user.email}'`;
        }
        const sqlResponse = await pool.request().query(userCheckQuery);
        const recordSet = sqlResponse.recordset;
        if (recordSet.length)
            return recordSet;
        else
            return undefined;
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function createNewUser(user) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        if (!(user === null || user === void 0 ? void 0 : user.role)) {
            user.role = config_1.config.default_user_role;
        }
        const addUserQuery = `insert into Users(email, password, role) values('${user === null || user === void 0 ? void 0 : user.email}', '${user === null || user === void 0 ? void 0 : user.password}', '${user === null || user === void 0 ? void 0 : user.role}')`;
        await pool.request().query(addUserQuery);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function getUsersFromDB(limit, offset, role) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        let query = `SELECT user_id, email, role FROM Users`;
        if (role) {
            query += ` WHERE role = '${role}'`;
        }
        query += ` ORDER BY user_id OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
        const users = await request.query(query);
        return users.recordset;
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function deleteUserFromDB(user) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        const query = `delete from Users where user_id = '${user.id}'`;
        await request.query(query);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function updateUserPasswordInDb(user) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        const query = `update Users set Password = '${user.password}' where user_id = '${user.id}'`;
        await request.query(query);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function geArtistsFromDB(limit, offset, grammy, hidden) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
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
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function getExtistingArtist(artist) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        let artistCheckQuery = ``;
        const request = pool.request();
        if (artist === null || artist === void 0 ? void 0 : artist.artist_id) {
            request.input('ArtistId', artist.artist_id);
            artistCheckQuery = `SELECT * FROM Artists WHERE artist_id = @ArtistId`;
        }
        if (!(artist === null || artist === void 0 ? void 0 : artist.artist_id) && (artist === null || artist === void 0 ? void 0 : artist.name)) {
            request.input('name', artist.name);
            artistCheckQuery = `SELECT * FROM Artists WHERE name = @name`;
        }
        const sqlResponse = await request.query(artistCheckQuery);
        const recordSet = sqlResponse.recordset;
        if (recordSet.length)
            return recordSet;
        else
            return undefined;
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function addNewArtist(artist) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const artistInsertQuery = `insert into Artists(name, grammy, hidden) values('${artist === null || artist === void 0 ? void 0 : artist.name}', ${artist === null || artist === void 0 ? void 0 : artist.grammy}, ${(artist === null || artist === void 0 ? void 0 : artist.hidden) ? 1 : 0})`;
        await pool.request().query(artistInsertQuery);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function updateArtistInDB(artist) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        let artistUpdateQuery = `update Artists set `;
        const updates = [];
        if (artist === null || artist === void 0 ? void 0 : artist.name) {
            updates.push(`name = '${artist === null || artist === void 0 ? void 0 : artist.name}'`);
        }
        if (artist === null || artist === void 0 ? void 0 : artist.grammy) {
            updates.push(`grammy = ${artist === null || artist === void 0 ? void 0 : artist.grammy}`);
        }
        if (artist === null || artist === void 0 ? void 0 : artist.hidden) {
            updates.push(`hidden = ${(artist === null || artist === void 0 ? void 0 : artist.hidden) ? 1 : 0}`);
        }
        artistUpdateQuery += updates.join(', ');
        artistUpdateQuery += ` WHERE artist_id = '${artist === null || artist === void 0 ? void 0 : artist.artist_id}'`;
        await pool.request().query(artistUpdateQuery);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function deleteArtistFromDB(artist) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        const query = `delete from Artists where artist_id = '${artist.artist_id}'`;
        await request.query(query);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function geAlbumsFromDB(limit, offset, artist_id, hidden) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        let query = `SELECT album.album_id, artist.name as artist_name, album.name, album.year, album.hidden FROM Albums album join ` +
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
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function getExistingAlbum(album) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        let albumCheckQuery = ``;
        const request = pool.request();
        if (album === null || album === void 0 ? void 0 : album.album_id) {
            request.input('AlbumId', album.album_id);
            albumCheckQuery = `SELECT album.album_id, artist.name as artist_name, album.name, album.year, album.hidden FROM Albums album join ` +
                `Artists artist on artist.artist_id = album.artist_id WHERE album.album_id = @AlbumId`;
        }
        if (!(album === null || album === void 0 ? void 0 : album.album_id) && (album === null || album === void 0 ? void 0 : album.name)) {
            request.input('name', album.name);
            albumCheckQuery = `SELECT album.album_id, artist.name as artist_name, album.name, album.year, album.hidden FROM Albums album join ` +
                `Artists artist on artist.artist_id = album.artist_id WHERE album.name = @name`;
        }
        const sqlResponse = await request.query(albumCheckQuery);
        const recordSet = sqlResponse.recordset;
        if (recordSet.length)
            return recordSet;
        else
            return undefined;
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function addNewAlbum(album) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const albumInsertQuery = `insert into Albums(artist_id, name, year, hidden) values('${album === null || album === void 0 ? void 0 : album.artist_id}', '${album === null || album === void 0 ? void 0 : album.name}', ${album === null || album === void 0 ? void 0 : album.year}, ${(album === null || album === void 0 ? void 0 : album.hidden) ? 1 : 0})`;
        await pool.request().query(albumInsertQuery);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function updateAlbumInDB(album) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        let albumUpdateQuery = `update Albums set `;
        const updates = [];
        if (album === null || album === void 0 ? void 0 : album.name) {
            updates.push(`name = '${album === null || album === void 0 ? void 0 : album.name}'`);
        }
        if (album === null || album === void 0 ? void 0 : album.year) {
            updates.push(`year = ${album === null || album === void 0 ? void 0 : album.year}`);
        }
        if (album === null || album === void 0 ? void 0 : album.hidden) {
            updates.push(`hidden = ${(album === null || album === void 0 ? void 0 : album.hidden) ? 1 : 0}`);
        }
        albumUpdateQuery += updates.join(', ');
        albumUpdateQuery += ` WHERE album_id = '${album === null || album === void 0 ? void 0 : album.album_id}'`;
        await pool.request().query(albumUpdateQuery);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function deleteAlbumFromDB(album) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        const query = `delete from Albums where album_id = '${album.album_id}'`;
        await request.query(query);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function geTracksFromDB(limit, offset, artist_id, album_id, hidden) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        let query = `SELECT track.track_id, album.name as album_name, artist.name as artist_name, track.name, track.duration, track.hidden FROM Tracks track` +
            ` join Albums album on album.album_id = track.album_id` +
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
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function getExistingTrack(track) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        let trackCheckQuery = ``;
        const request = pool.request();
        if (track === null || track === void 0 ? void 0 : track.track_id) {
            request.input('TrackId', track.track_id);
            trackCheckQuery = `SELECT track.track_id, album.name as album_name, artist.name as artist_name, track.name, track.duration, track.hidden FROM Tracks track` +
                ` join Albums album on album.album_id = track.album_id` +
                ` join Artists artist on artist.artist_id = track.artist_id WHERE track.track_id = @TrackId`;
        }
        if (!(track === null || track === void 0 ? void 0 : track.track_id) && (track === null || track === void 0 ? void 0 : track.name)) {
            request.input('name', track.name);
            trackCheckQuery = `SELECT track.track_id, album.name as album_name, artist.name as artist_name, track.name, track.duration, track.hidden FROM Tracks track` +
                ` join Albums album on album.album_id = track.album_id` +
                ` join Artists artist on artist.artist_id = track.artist_id WHERE track.name = @name`;
        }
        const sqlResponse = await request.query(trackCheckQuery);
        const recordSet = sqlResponse.recordset;
        if (recordSet.length)
            return recordSet;
        else
            return undefined;
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function addNewTrack(track) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const trackInsertQuery = `insert into Tracks(album_id, artist_id, name, duration, hidden) values('${track === null || track === void 0 ? void 0 : track.album_id}', '${track === null || track === void 0 ? void 0 : track.artist_id}', '${track === null || track === void 0 ? void 0 : track.name}', ${track === null || track === void 0 ? void 0 : track.duration}, ${(track === null || track === void 0 ? void 0 : track.hidden) ? 1 : 0})`;
        await pool.request().query(trackInsertQuery);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function updateTrackInDB(track) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        let trackUpdateQuery = `update Tracks set `;
        const updates = [];
        if (track === null || track === void 0 ? void 0 : track.name) {
            updates.push(`name = '${track === null || track === void 0 ? void 0 : track.name}'`);
        }
        if (track === null || track === void 0 ? void 0 : track.duration) {
            updates.push(`duration = ${track === null || track === void 0 ? void 0 : track.duration}`);
        }
        if (track === null || track === void 0 ? void 0 : track.hidden) {
            updates.push(`hidden = ${(track === null || track === void 0 ? void 0 : track.hidden) ? 1 : 0}`);
        }
        trackUpdateQuery += updates.join(', ');
        trackUpdateQuery += ` WHERE track_id = '${track === null || track === void 0 ? void 0 : track.track_id}'`;
        await pool.request().query(trackUpdateQuery);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function deleteTrackFromDB(track) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        const query = `delete from Tracks where track_id = '${track.track_id}'`;
        await request.query(query);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function getFavoritesFromDB(limit, offset, user_id, category) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        const select_clause = `SELECT f.favorite_id, f.category, f.item_id, a.name, created_at FROM Favorites f `;
        let join_clause = ``;
        if (category === 'artist') {
            join_clause = `join Artists a on f.item_id = a.artist_id`;
        }
        else if (category === 'album') {
            join_clause = `join ALbums a on f.item_id = a.album_id`;
        }
        else if (category === 'track') {
            join_clause = `join Tracks a on f.item_id = a.track_id`;
        }
        const where_clause = ` WHERE user_id = '${user_id}' AND category = '${category}' ORDER BY created_at OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
        const query = select_clause + join_clause + where_clause;
        const sqlResponse = await request.query(query);
        const recordSet = sqlResponse.recordset;
        if (recordSet.length)
            return recordSet;
        else
            return undefined;
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function checkItemIdExitsts(favorite) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        let resourceQuery = '';
        if (favorite === null || favorite === void 0 ? void 0 : favorite.favorite_id) {
            resourceQuery = `SELECT * FROM Favorites WHERE favorite_id = '${favorite === null || favorite === void 0 ? void 0 : favorite.favorite_id}'`;
        }
        else if ((favorite === null || favorite === void 0 ? void 0 : favorite.category) === 'artist') {
            resourceQuery = `SELECT artist_id FROM Artists WHERE artist_id = '${favorite === null || favorite === void 0 ? void 0 : favorite.item_id}'`;
        }
        else if ((favorite === null || favorite === void 0 ? void 0 : favorite.category) === 'album') {
            resourceQuery = `SELECT album_id FROM Albums WHERE album_id = '${favorite === null || favorite === void 0 ? void 0 : favorite.item_id}'`;
        }
        else if ((favorite === null || favorite === void 0 ? void 0 : favorite.category) === 'track') {
            resourceQuery = `SELECT track_id FROM Tracks WHERE track_id = '${favorite === null || favorite === void 0 ? void 0 : favorite.item_id}'`;
        }
        const resourceExists = await request.query(resourceQuery);
        if (resourceExists.recordset.length !== 0)
            return true;
        else
            return false;
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function createNewFavorite(favorite) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const addUserQuery = `insert into Favorites(user_id, category, item_id) values('${favorite === null || favorite === void 0 ? void 0 : favorite.uesr_id}', '${favorite === null || favorite === void 0 ? void 0 : favorite.category}', '${favorite === null || favorite === void 0 ? void 0 : favorite.item_id}')`;
        await pool.request().query(addUserQuery);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
async function deleteFavoriteFromDB(favorite) {
    try {
        const pool = await (0, DBConnection_1.getDbConnection)();
        const request = pool.request();
        const query = `delete from Favorites where favorite_id = '${favorite.favorite_id}'`;
        await request.query(query);
    }
    catch (error) {
        console.log("SQL server error - " + error.message);
        throw new Error(error.message);
    }
}
//# sourceMappingURL=musicLibrarySQLDataStore.js.map