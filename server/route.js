
const {Server} = require("@tus/server")
const {FileStore} = require("@tus/file-store")

const host = '127.0.0.1'
const port = 1080

const maxSizeInBytes = 4 * 1024 * 1024 * 1024;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

const server = new Server({
    path: "/uploads",
    datastore: new FileStore({directory: "../../uploads"}),
    maxSize: maxSizeInBytes,
    onUploadCreate: async (req, res, upload) => {
        const mimeType = upload.metadata['mime-type'];

        if (!allowedMimeTypes.includes(mimeType)) {
            return {
                res: res.status(400).send('Unsupported file type'),
            };
        }

        return { res, metadata: {} };
    },
})


server.listen({host, port})

