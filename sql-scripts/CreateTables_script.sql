USE MusicLibrary;
GO


-- Users Table
CREATE TABLE Users (
    user_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Editor', 'Viewer'))
	);

-- Artists Table
CREATE TABLE Artists (
    artist_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    grammy int DEFAULT 0,
    hidden BIT DEFAULT 0
);

-- Albums Table
CREATE TABLE Albums (
    album_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	artist_id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(255) NOT NULL,
    year INT NOT NULL,
    hidden BIT DEFAULT 0,
	FOREIGN KEY (artist_id) REFERENCES Artists(artist_id)
);

-- Tracks Table
CREATE TABLE Tracks (
    track_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    artist_id UNIQUEIDENTIFIER NOT NULL,
    album_id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    hidden BIT DEFAULT 0,
    FOREIGN KEY (artist_id) REFERENCES Artists(artist_id),
    FOREIGN KEY (album_id) REFERENCES Albums(album_id)
);

-- Favorites Table
CREATE TABLE Favorites (
    favorite_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL,
    category NVARCHAR(50) NOT NULL,
    item_id UNIQUEIDENTIFIER NOT NULL,
    created_at DATETIME DEFAULT GETDATE() NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CHECK (category IN ('artist', 'album', 'track'))
);