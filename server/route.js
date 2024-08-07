const {Server} = require("@tus/server'")
const {FileStore} = require("@tus/file-store")

const host = '127.0.0.1'
const port = 1080

const maxSizeInBytes = 4 * 1024 * 1024 * 1024;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

const server = new Server({
    path: "/files",
    datastore: new FileStore({directory: "./files"}),
    maxSize: maxSizeInBytes,
})


server.listen({host, port})