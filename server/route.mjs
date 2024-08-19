import {Server} from "@tus/server";
import {FileStore} from "@tus/file-store";
import fs from "fs";
import {resolve} from "path";
import {readFileSync} from "fs";
import {fileTypeFromFile} from "file-type";

const host = "127.0.0.1";
const port = 1080;

const maxSizeInBytes = 4 * 1024 * 1024 * 1024;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];


const server = new Server({
    path: "/uploads",
    datastore: new FileStore({directory: "../../temp"}),
    maxSize: maxSizeInBytes,
    onUploadCreate: (req, res, upload) => {
        if (!allowedMimeTypes.includes(upload.metadata.filetype)) {
            return;
        }
        res.statusCode = 200;
        return {res};
    },

    onUploadFinish: async (req, res, upload) => {
        try {

            const mime = await fileTypeFromFile(`../../temp/${upload.id}`);

            if (allowedMimeTypes.includes(mime.mime)) {
                if (!fs.existsSync("../../uploads")) {
                    fs.mkdirSync("../../uploads");
                }

                const originalFilePath = path.join("../../temp", upload.id);
                console.log(originalFilePath)

                const newFilePath = path.join("../../uploads", `${upload.id}`);
                console.log(newFilePath)

                const originalJsonFilePath = path.join("../../temp", `${upload.id}.json`);
                console.log(originalFilePath)

                const newJsonFilePath = path.join("../../uploads", `${upload.id}.json`);
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
