BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AttachmetnsMetaData] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fileId] INT NOT NULL,
    [requestEmail] NVARCHAR(1000) NOT NULL,
    [fileType] NVARCHAR(1000) NOT NULL,
    [size] INT NOT NULL,
    [creation_date] DATETIME2 NOT NULL,
    CONSTRAINT [AttachmetnsMetaData_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AttachmetnsMetaData_fileId_key] UNIQUE NONCLUSTERED ([fileId])
);

-- AddForeignKey
ALTER TABLE [dbo].[AttachmetnsMetaData] ADD CONSTRAINT [AttachmetnsMetaData_requestEmail_fkey] FOREIGN KEY ([requestEmail]) REFERENCES [dbo].[Form]([email]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
