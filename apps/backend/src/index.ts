import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from "socket.io";
import connectDB from './db';
import { getAllExpressions, insertExpression } from './service/Expression.service';


dotenv.config()

const  bootstrap = async () => {

    
const port: number = parseInt(process.env.PORT || '3000', 10);
const app: Express = express();
app.use(express.json()); // Middleware to parse JSON bodies

await connectDB()

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

// Route to retrieve all expressions
app.get('/expressions', async (req: Request, res: Response) => {
    try {
        const expressions = await getAllExpressions();
        res.status(200).json(expressions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving expressions', error });
    }
});



// Route to create a new expression
app.post('/expressions', async (req: Request, res: Response) => {
    const { expression, result } = req.body;

    try {
        const newExpression = await insertExpression(expression, result);
        res.status(201).json(newExpression);
    } catch (error) {
        res.status(500).json({ message: 'Error creating expression', error });
    }
});


server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
})



}


bootstrap()