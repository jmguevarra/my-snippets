CREATE PROCEDURE [dbo].[sp_SaveTwoFactorAuthByEmail]
(
    @Email AS VARCHAR(500),
    @Provider AS VARCHAR(500),
    @PublicIP AS VARCHAR(255),
    @QRCode AS VARCHAR(MAX),
    @ClientKey AS VARCHAR(MAX),
    @SecretKey AS VARCHAR(MAX)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        UPDATE [dbo].[User]
        SET AuthenticationDate2FA = GETDATE(), 
            Email2FA = @Email,
            Provider2FA = @Provider,
            PublicIP2FA = @PublicIP,
            QRCode2FA = @QRCode,
            ClientKey2FA = @ClientKey,
            SecretKey2FA = @SecretKey
        WHERE [Email] = @Email;

        -- Check if the update was successful
        IF @@ROWCOUNT = 0
        BEGIN
            -- If no rows were updated, return 0
            SELECT 0;
        END
        ELSE
        BEGIN
            -- If the update was successful, return 1
            SELECT 1;
        END
    END TRY
    BEGIN CATCH
        -- Handle any errors that occurred during the update
        SELECT ERROR_MESSAGE() AS ErrorMessage;
        SELECT 0;
    END CATCH
END
