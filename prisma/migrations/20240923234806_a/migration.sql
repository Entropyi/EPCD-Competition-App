BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[form] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fullName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [age] INT NOT NULL CONSTRAINT [form_age_df] DEFAULT 0,
    [phoneNumber] NVARCHAR(1000) NOT NULL,
    [photoTitle] NVARCHAR(1000) CONSTRAINT [form_photoTitle_df] DEFAULT 'nill',
    [comment] NVARCHAR(1000) CONSTRAINT [form_comment_df] DEFAULT 'nill',
    [photoLocation] NVARCHAR(1000) NOT NULL,
    [photoPurpose] NVARCHAR(1000) CONSTRAINT [form_photoPurpose_df] DEFAULT 'nill',
    [creationDate] DATETIME2 NOT NULL,
    CONSTRAINT [form_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [form_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [form_phoneNumber_key] UNIQUE NONCLUSTERED ([phoneNumber])
);

-- CreateTable
CREATE TABLE [dbo].[AttachmetnsMetaData] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fileId] NVARCHAR(1000) NOT NULL,
    [requestEmail] NVARCHAR(1000) NOT NULL,
    [fileType] NVARCHAR(1000) NOT NULL,
    [size] INT NOT NULL,
    [relativePath] NVARCHAR(1000) NOT NULL,
    [creation_date] DATETIME2 NOT NULL,
    CONSTRAINT [AttachmetnsMetaData_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AttachmetnsMetaData_fileId_key] UNIQUE NONCLUSTERED ([fileId])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [email_verified] DATETIME2,
    [image] NVARCHAR(1000),
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[verificationtokens] (
    [identifier] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [verificationtokens_identifier_token_key] UNIQUE NONCLUSTERED ([identifier],[token])
);

-- AddForeignKey
ALTER TABLE [dbo].[form] ADD CONSTRAINT [form_email_fkey] FOREIGN KEY ([email]) REFERENCES [dbo].[users]([email]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AttachmetnsMetaData] ADD CONSTRAINT [AttachmetnsMetaData_requestEmail_fkey] FOREIGN KEY ([requestEmail]) REFERENCES [dbo].[users]([email]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
