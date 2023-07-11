IF OBJECT_ID('UserLogs', 'U') IS NOT NULL
    DROP TABLE UserLogs;

-- Create the UserLogs table
CREATE TABLE UserLogs (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Email] NVARCHAR(255) NOT NULL,
    [Type] NVARCHAR(50) NOT NULL,
    [IsSuccess] BIT NOT NULL,
    [Token] NVARCHAR(255),
    [MacAddress] NVARCHAR(50) NOT NULL,
    [LogDate] DATETIME NOT NULL
);
