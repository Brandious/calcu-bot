import { ActionType } from './../../shared/src/index';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from "socket.io";
import connectDB from './db';
import { getAllExpressions, insertExpression } from './service/Expression.service';
import { evaluateExpression } from "math-lib"

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
    socket.on('message',async (data) => {
        const { type, expression } = data; // Destructure type and expression from the data
        console.log(type, expression, ActionType.EVALUATE === type)
        try {
            if (type === ActionType.HISTORY) {
                const expressions = await getAllExpressions(); // Retrieve expressions from the database
                socket.emit('history', expressions); // Emit the history back to the client
            } else if (type === ActionType.EVALUATE) {
                const result = evaluateExpression(expression); // Evaluate the mathematical expression
                console.log(result)
                const newExpression = await insertExpression(expression, result); // Save the expression and result to the database
                console.log(newExpression, result)
                socket.emit('result', result); // Emit the result back to the client
        
            } else {
                socket.emit('error', 'Invalid action type'); // Handle invalid action type
            }
        } catch (error) {
            console.error('Error processing request:', error);
            socket.emit('error', 'Error processing request');
        }
    });
});

app.get('/hello', async (_: Request, res: Response) => {

    console.log(evaluateExpression("2+2+2+2"))
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