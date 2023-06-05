/****** Object:  StoredProcedure [dbo].[sp_GetUserInfoByEmails]    Script Date: 6/5/2023 8:29:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetUserInfoByEmails] 
(@Emails AS VARCHAR(50))
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @EmailTable TABLE (Email VARCHAR(MAX));
    INSERT INTO @EmailTable (Email)
    SELECT value FROM STRING_SPLIT(@Emails, ',');

	SELECT 
		[u].[Id]							AS [UserId],
		[u].[Position]						AS [Position],
		[u].[Email]							AS [Email], 
		[u].[Firstname]						AS [FirstName], 
		[u].[Middlename]					AS [MiddleName], 
		[u].[Lastname]						AS [LastName], 
		[u].[PlatformClientId]				AS [PlatformClientId],
		CASE
		 WHEN [u].[Middlename] IS NOT NULL
		 THEN [u].[Firstname]+' '+[u].[Middlename]+' '+[u].[Lastname]
		 ELSE [u].[Firstname]+' '+[u].[Lastname]
		END									AS [Fullname]

    FROM [dbo].[Users] [u]
    WHERE [u].[Email] IN (SELECT Email FROM @EmailTable) AND [u].[Deleted] = 0;
END
