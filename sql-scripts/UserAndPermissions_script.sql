--Create a Database User
CREATE LOGIN MusicLibraryUser WITH PASSWORD = 'MusicLibrary@123';
CREATE USER MusicLibraryUser FOR LOGIN MusicLibraryUser;
GO

--Grant Permissions
ALTER ROLE db_datareader ADD MEMBER MusicLibraryUser;
ALTER ROLE db_datawriter ADD MEMBER MusicLibraryUser;
GO
