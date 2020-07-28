const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)
const port = 3000

var docs = []

app.use(express.static("dist"))

io.on("connection", (socket) => {
    console.log("connect!")

    socket.on("updates", (updates) => {
        console.log(updates)
        io.emit("updates", updates)
    })

    socket.on("disconnect", (socket) => {
        console.log("disconnect")
    })
})

http.listen(port, () => console.log(`Listening at http://localhost:${port}`))
