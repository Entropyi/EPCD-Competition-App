/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accessTokenExpires` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerType` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accessToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `VerificationRequest` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Account] DROP CONSTRAINT [Account_providerId_providerAccountId_key];

-- DropIndex
ALTER TABLE [dbo].[Session] DROP CONSTRAINT [Session_accessToken_key];

-- AlterTable
ALTER TABLE [dbo].[Account] DROP COLUMN [accessToken],
[accessTokenExpires],
[providerId],
[providerType],
[refreshToken];
ALTER TABLE [dbo].[Account] ADD [access_token] TEXT,
[expires_at] INT,
[id_token] TEXT,
[provider] NVARCHAR(1000) NOT NULL,
[refresh_token] TEXT,
[refresh_token_expires_in] INT,
[scope] NVARCHAR(1000),
[session_state] NVARCHAR(1000),
[token_type] NVARCHAR(1000),
[type] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Session] DROP COLUMN [accessToken];

-- AlterTable
ALTER TABLE [dbo].[User] ADD [username] NVARCHAR(1000);

-- DropTable
DROP TABLE [dbo].[VerificationRequest];

-- CreateTable
CREATE TABLE [dbo].[VerificationToken] (
    [identifier] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [VerificationToken_identifier_token_key] UNIQUE NONCLUSTERED ([identifier],[token])
);

-- CreateIndex
ALTER TABLE [dbo].[Account] ADD CONSTRAINT [Account_userId_key] UNIQUE NONCLUSTERED ([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Account_userId_idx] ON [dbo].[Account]([userId]);

-- CreateIndex
ALTER TABLE [dbo].[Account] ADD CONSTRAINT [Account_provider_providerAccountId_key] UNIQUE NONCLUSTERED ([provider], [providerAccountId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Session_userId_idx] ON [dbo].[Session]([userId]);

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
