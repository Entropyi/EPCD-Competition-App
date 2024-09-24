import {Server} from "@tus/server";
import {FileStore} from "@tus/file-store";
import fs from "fs";
import {resolve} from "path";
import {fileTypeFromFile} from "file-type";
import prisma from "../prisma/prismajs.js";

const host = "127.0.0.1";
const port = 1080;

const maxSizeInBytes = 4 * 1024 * 1024 * 1024;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];


const server = new Server({
    path: "/uploads",
    datastore: new FileStore({directory: "../../temp"}),
    maxSize: maxSizeInBytes,
    onUploadCreate: async (req, res, upload) => {
        const FormEntriesCount = await prisma.request.count({
            where: {email: upload.metadata.userId},
        })

        if (!allowedMimeTypes.includes(upload.metadata.filetype)) {
            return;
        } else if (FormEntriesCount === 0) {
            res.statusCode = 200;
            return {res};
        }
        return;
    },

    onUploadFinish: async (req, res, upload) => {
        try {

            const mime = await fileTypeFromFile(`../../temp/${upload.id}`);

            if (allowedMimeTypes.includes(mime.mime)) {
                await prisma.attachmetnsMetaData.create({
                    data: {
                        fileId: upload.id,
                        requestEmail: upload.metadata.userId,
                        size: upload.size,
                        fileType: upload.metadata.filetype,
                        relativePath: `../../upload/${upload.id}`,
                        creation_date: upload.creation_date,
                    },
                });

                if (!fs.existsSync("../../uploads")) {
                    fs.mkdirSync("../../uploads");
                }

                const originalFilePath = resolve("../../temp", upload.id);
                const newFilePath = resolve("../../uploads", `${upload.id}`);

                const originalJsonFilePath = resolve("../../temp", `${upload.id}.json`);
                const newJsonFilePath = resolve("../../uploads", `${upload.id}.json`);

                fs.rename(originalFilePath, newFilePath, (err) => {
                    fs.rename(originalJsonFilePath, newJsonFilePath, (err) => {
                        return {res};
                    })
                })

                return {res};
            } else {
                fs.unlink(`../../temp/${upload.id}`, err => {
                })

                fs.unlink(`../../temp/${upload.id}.json`, err => {
                })

                throw {status_code: 400, body: "Upload failed due to validation error."};

            }

        } catch (error) {
            throw {status_code: 400, body: "Upload failed due to validation error."};
        }
    },


});

async function cleanUpExpiredUploads() {
    const tempStoreDirectory = "../../temp";
    const expirationTime = 60 * 60 * 1000;

    try {
        const files = await fs.promises.readdir(tempStoreDirectory);

        for (const file of files) {
            if (file.endsWith('.json')) continue;

            const filePath = `${tempStoreDirectory}/${file}`;
            const jsonFilePath = `../../temp/${file}.json`;


            if (fs.existsSync(jsonFilePath)) {
                const jsonData = await fs.promises.readFile(jsonFilePath, 'utf8');
                const metadata = JSON.parse(jsonData);
                const creationDate = new Date(metadata.creation_date);

                if (Date.now() - creationDate.getTime() > expirationTime) {
                    await fs.promises.unlink(filePath);
                    await fs.promises.unlink(jsonFilePath);
                    console.log(`Deleted expired upload: ${filePath} and ${jsonFilePath}`);
                }
            } else {
                console.warn(`file ${file} Skipping.`);
            }
        }
    } catch (error) {
        console.error("Error cleaning up expired uploads:", error);
    }
}

const TokenExpirationTime = 24 * 60 * 60 * 1000;
const TempFilesExpirationTime = 60 * 60 * 1000;

async function cleanUpExpiredTokens() {
    try {
        const now = new Date();
        const expiredTokens = await prisma.verificationToken.findMany({
            where: {
                expires: {
                    lt: now,
                },
            },
        });

        for (const token of expiredTokens) {
            await prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: token.identifier,
                        token: token.token,
                    },
                },
            });
            console.log(`Deleted expired token: ${token.identifier}, ${token.token}`);
        }

    } catch (error) {
        console.error("Error cleaning up expired tokens:", error);
    }
}

setInterval(cleanUpExpiredTokens, TokenExpirationTime);
setInterval(cleanUpExpiredUploads, TempFilesExpirationTime);

server.listen({host, port});
