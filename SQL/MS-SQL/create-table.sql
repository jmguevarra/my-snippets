CREATE TABLE AppUserLogs (
    [Id] INT IDENTITY(1000,1) PRIMARY KEY,
	[AppId] INT,
	[Email] NVARCHAR(255),
    [Type] NVARCHAR(50),
    [IsSuccess] BIT,
    [Token] NVARCHAR(255),
    [MacAddress] NVARCHAR(50),
    [LogDate] DATETIME
);
