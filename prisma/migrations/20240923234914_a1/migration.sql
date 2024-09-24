/*
  Warnings:

  - You are about to drop the `form` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[form] DROP CONSTRAINT [form_email_fkey];

-- DropTable
DROP TABLE [dbo].[form];

-- CreateTable
CREATE TABLE [dbo].[Request] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fullName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [age] INT NOT NULL CONSTRAINT [Request_age_df] DEFAULT 0,
    [phoneNumber] NVARCHAR(1000) NOT NULL,
    [photoTitle] NVARCHAR(1000) CONSTRAINT [Request_photoTitle_df] DEFAULT 'nill',
    [comment] NVARCHAR(1000) CONSTRAINT [Request_comment_df] DEFAULT 'nill',
    [photoLocation] NVARCHAR(1000) NOT NULL,
    [photoPurpose] NVARCHAR(1000) CONSTRAINT [Request_photoPurpose_df] DEFAULT 'nill',
    [creationDate] DATETIME2 NOT NULL,
    CONSTRAINT [Request_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Request_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Request_phoneNumber_key] UNIQUE NONCLUSTERED ([phoneNumber])
);

-- AddForeignKey
ALTER TABLE [dbo].[Request] ADD CONSTRAINT [Request_email_fkey] FOREIGN KEY ([email]) REFERENCES [dbo].[users]([email]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
