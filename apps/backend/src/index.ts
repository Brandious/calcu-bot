import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { evaluateExpression } from "@calcu-bot/math-lib";
import { Server } from "socket.io";
import { ActionType, ResponseStatus, SocketState } from '@calcu-bot/shared';
import connectDB from './db';
import { getLatestExpressions, insertExpression } from './service/Expression.service';
import path from 'path';

dotenv.config()

const  bootstrap = async () => {

const port: number = parseInt(process.env.PORT || '3000', 10);
const app: Express = express();
app.use(express.json()); // Middleware to parse JSON bodies

await connectDB()

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/')));

// Create an HTTP server
const server = require('http').createServer(app);

// Create a Socket.IO server
const io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_URL, // Vite's default port
      methods: ["GET", "POST"],
      credentials: true
    },
    path: '/socket.io'
  });

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnection
    socket.on(SocketState.DISCONNECT, () => {
        console.log('A user disconnected');
    });

    // Example of handling a custom event
    socket.on(SocketState.MESSAGE,async (data) => {
        const { type, expression } = data; // Destructure type and expression from the data
       
        try {
            if (type === ActionType.HISTORY) {
                const expressions = await getLatestExpressions(10, 1); // Retrieve expressions from the database
                const response = {
                    status: ResponseStatus.SUCCESS,
                    data: expressions
                    
                }
                socket.emit(SocketState.HISTORY, response); // Emit the history back to the client
            } else if (type === ActionType.EVALUATE) {
                const result = evaluateExpression(expression); // Evaluate the mathematical expression
                const newExpression = await insertExpression(expression, result); // Save the expression and result to the database

                const response = {
                    status: ResponseStatus.SUCCESS,
                    data: {
                        expression: newExpression.expression,
                        result
                    }
                }

                socket.emit(SocketState.RESULT, response); // Emit the result back to the client
        
            } else {
                const response = {
                    status: 'error',
                    message: "Invalid action type"
                }
                socket.emit(SocketState.ERROR, response); // Handle invalid action type
            }
        } catch (error) {
            console.error('Error processing request:', error);
            const response = {
                status: ResponseStatus.ERROR,
                message: "Error processing request"
            }
            socket.emit(SocketState.ERROR, response);
        }
    });
});


// Route to serve the React app
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

server.listen(port, () => {
    console.log(`>> Ready on port:${port}`);
})



}


bootstrap()