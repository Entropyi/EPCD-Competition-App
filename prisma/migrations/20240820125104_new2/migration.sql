/*
  Warnings:

  - You are about to drop the column `access_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `id_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token_expires_in` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[providerId,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessToken]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerType` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessToken` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Account] DROP CONSTRAINT [Account_provider_providerAccountId_key];

-- DropIndex
DROP INDEX [Account_userId_idx] ON [dbo].[Account];

-- DropIndex
ALTER TABLE [dbo].[Account] DROP CONSTRAINT [Account_userId_key];

-- DropIndex
DROP INDEX [Session_userId_idx] ON [dbo].[Session];

-- DropIndex
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_username_key];

-- AlterTable
ALTER TABLE [dbo].[Account] DROP COLUMN [access_token],
[expires_at],
[id_token],
[provider],
[refresh_token],
[refresh_token_expires_in],
[scope],
[session_state],
[token_type],
[type];
ALTER TABLE [dbo].[Account] ADD [accessToken] NVARCHAR(1000),
[accessTokenExpires] DATETIME2,
[providerId] NVARCHAR(1000) NOT NULL,
[providerType] NVARCHAR(1000) NOT NULL,
[refreshToken] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Session] ADD [accessToken] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [username];

-- DropTable
DROP TABLE [dbo].[VerificationToken];

-- CreateTable
CREATE TABLE [dbo].[VerificationRequest] (
    [id] NVARCHAR(1000) NOT NULL,
    [identifier] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [VerificationRequest_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [VerificationRequest_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [VerificationRequest_token_key] UNIQUE NONCLUSTERED ([token]),
    CONSTRAINT [VerificationRequest_identifier_token_key] UNIQUE NONCLUSTERED ([identifier],[token])
);

-- CreateIndex
ALTER TABLE [dbo].[Account] ADD CONSTRAINT [Account_providerId_providerAccountId_key] UNIQUE NONCLUSTERED ([providerId], [providerAccountId]);

-- CreateIndex
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [Session_accessToken_key] UNIQUE NONCLUSTERED ([accessToken]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
