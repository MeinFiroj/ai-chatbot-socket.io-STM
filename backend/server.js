require('dotenv').config()
const app = require("./src/app")
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require('./src/service/ai.service');

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const chatHistory = []

io.on("connection", (socket) => {
    console.log("Socket connected")

    socket.on('disconnect', () => {
        console.log("Socket disconnected")
    })

    socket.on('ai-message', async (prompt) => {
        chatHistory.push({
            role : "user",
            parts : [{text : prompt}]
        })

        const response = await generateResponse(chatHistory)

        socket.emit('ai-message-response', response)

        chatHistory.push({
            role : "model",
            parts : [{text : response}]
        })
    })

});




httpServer.listen(3000, () => {
    console.log("Server is running on port 3000")
})