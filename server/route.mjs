import {Server} from "@tus/server";
import {FileStore} from "@tus/file-store";
import fs from "fs";
import {resolve} from "path";
import {fileTypeFromFile} from "file-type";
import { PrismaClient } from "@prisma/client"

const host = "127.0.0.1";
const port = 1080;

const maxSizeInBytes = 4 * 1024 * 1024 * 1024;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

const prisma = new PrismaClient();

const server = new Server({
    path: "/uploads",
    datastore: new FileStore({directory: "../../temp"}),
    maxSize: maxSizeInBytes,
    onUploadCreate: async (req, res, upload) => {
        const FormEntriesCount = await prisma.form.count({
            where: {email: upload.metadata.userId},
        })

        if (!allowedMimeTypes.includes(upload.metadata.filetype)) {
            return;
        }

        else if(FormEntriesCount === 0){
            res.statusCode = 200;
            return {res};
        }
        return;
    },

    onUploadFinish: async (req, res, upload) => {
        try {

            const mime = await fileTypeFromFile(`../../temp/${upload.id}`);

            console.log(mime.mime);

            if (allowedMimeTypes.includes(mime.mime)) {
                console.log("if is true")
                if (!fs.existsSync("../../uploads")) {
                    fs.mkdirSync("../../uploads");
                    console.log("file created")
                }

                const originalFilePath = resolve("../../temp", upload.id);
                console.log(` First path = ${originalFilePath}`)

                const newFilePath = resolve("../../uploads", `${upload.id}`);
                console.log(` Second path = ${newFilePath}`)

                const originalJsonFilePath = resolve("../../temp", `${upload.id}.json`);
                console.log(originalFilePath)

                const newJsonFilePath = resolve("../../uploads", `${upload.id}.json`);
                console.log(newJsonFilePath)

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
    const storeDirectory = "../../temp";
    const expirationTime = (24 * 60 * 60 * 1000) / 2;

    try {
        const files = await fs.promises.readdir(storeDirectory);

        for (const file of files) {
            const filePath = `${storeDirectory}/${file}`;
            const stat = await fs.promises.stat(filePath);

            if (Date.now() - stat.mtimeMs > expirationTime) {
                await fs.promises.unlink(filePath);
                console.log(`Deleted expired upload: ${filePath}`);
            }
        }
    } catch (error) {
        console.error("Error cleaning up expired uploads:", error);
    }
}



setInterval(cleanUpExpiredUploads, 3600000);
server.listen({host, port});
