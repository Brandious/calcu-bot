import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from "socket.io";


dotenv.config()

const port: number = parseInt(process.env.PORT || '3000', 10);

const app: Express = express();

// Create an HTTP server
const server = require('http').createServer(app);

// Create a Socket.IO server
const io = new Server(server);

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // Example of handling a custom event
    socket.on('message', (msg) => {
        console.log('Message received: ' + msg);
        // You can emit a response back to the client
        socket.emit('message', 'Message received: ' + msg);
    });
});

app.get('/hello', async (_: Request, res: Response) => {
    res.send('Hello World')
});

server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
})