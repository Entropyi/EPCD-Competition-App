BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Form] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fullName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [age] INT NOT NULL,
    [phoneNumber] INT NOT NULL,
    [imageUrl] NVARCHAR(1000) NOT NULL,
    [photoTitle] NVARCHAR(1000) CONSTRAINT [Form_photoTitle_df] DEFAULT 'nill',
    [comment] NVARCHAR(1000) CONSTRAINT [Form_comment_df] DEFAULT 'nill',
    [photoLocation] NVARCHAR(1000) NOT NULL,
    [photoPurpose] NVARCHAR(1000) CONSTRAINT [Form_photoPurpose_df] DEFAULT 'nill',
    CONSTRAINT [Form_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Form_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Form_phoneNumber_key] UNIQUE NONCLUSTERED ([phoneNumber])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
