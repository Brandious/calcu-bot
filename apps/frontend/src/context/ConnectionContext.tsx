// apps/frontend/src/context/ConnectionContext.tsx
import { message } from 'antd';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ActionType } from '../../../shared/src';
import { Evaluation, EvaluationResponse, HistoryResponse } from '../types';

// Define the shape of our context
interface ConnectionContextType {
    socket: Socket | null;
    isConnected: boolean;
    sessionResults: Array<Evaluation>;
    evaluate: (expression: string) => void;
    getHistory: () => void;
    clearResults: () => void;
}

// Create the context
const ConnectionContext = createContext<ConnectionContextType>({
    socket: null,
    isConnected: false,
    sessionResults: [],
    evaluate: () => { },
    getHistory: () => { },
    clearResults: () => { }
});

// Custom hook to use the connection context
export const useConnection = () => useContext(ConnectionContext);

interface ConnectionProviderProps {
    children: React.ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [sessionResults, setSessionResults] = useState<Array<Evaluation>>([]); // Store all session results


    useEffect(() => {

        // Initialize socket connection with the proxy path
        const socketInstance = io({
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            // Remove the explicit URL since we're using the proxy
        });

        // Set up event listeners
        socketInstance.on('connect', () => {

            console.log('Connected to server');
            setIsConnected(true);
        });


        socketInstance.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        // Store socket instance
        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    // Function to evaluate expression
    const evaluate = (expression: string) => {
        if (!socket) {
            message.error('Socket connection not available');
            return;
        }

        try {
            socket.emit('message', {
                type: ActionType.EVALUATE,
                expression
            }, (error: Error | null, response: EvaluationResponse) => {
                if (error) {
                    // Handle timeout or other socket errors
                    console.error('Socket error:', error);
                    message.error(`Connection error: ${error.message}`);
                    return;
                }

                if (response?.status === 'error') {
                    // Handle server-side errors
                    console.error('Server error:', response.message);
                    message.error(`Calculation error: ${response.message}`);
                    return;
                }


            });
        } catch (error) {
            // Handle any synchronous errors during emit
            console.error('Emission error:', error);
            message.error(`Failed to send calculation`);
        }

        // Set up error listener for this specific event
        socket.once('error', (error) => {
            console.error('Socket error event:', error);
            message.error(`Server error: ${error.message}`);
        });
    };

    // apps/frontend/src/context/ConnectionContext.tsx
    const getHistory = () => {
        if (!socket) {
            message.error('Socket connection not available');
            return;
        }

        try {
            socket.emit('message', {
                type: ActionType.HISTORY
            }, (error: Error | null, response: HistoryResponse) => {
                if (error) {
                    // Handle timeout or other socket errors
                    console.error('Socket error while fetching history:', error);
                    message.error(`Failed to fetch history: ${error.message}`);
                    return;
                }

                if (response?.status === 'error') {
                    // Handle server-side errors
                    console.error('Server error while fetching history:', response.message);
                    message.error(`History error: ${response.message}`);
                    return;
                }
            });

            // Set up error listener for this specific event
            socket.once('error', (error) => {
                console.error('Socket error event during history fetch:', error);
                message.error(`Server error while fetching history: ${error.message}`);
            });

        } catch (error) {
            // Handle any synchronous errors during emit
            console.error('Error sending history request:', error);
            message.error(`Failed to request history`);
        }
    };

    // Set up response listeners
    useEffect(() => {
        if (!socket) return;

        // Listen for evaluation results
        socket.on('result', (response) => {
            console.log('Evaluation result:', response);
            // You can add additional handling here
            if (response) {
                const newResult = {
                    expression: response.expression,
                    result: response.result,
                    timestamp: new Date(),
                    isHistory: false
                };
                setSessionResults(prev => [...prev, newResult]);

            } else {
                message.error(response?.message || 'Error evaluating expression');
            }
        });

        // Listen for history results
        socket.on('history', (response) => {
            console.log("Response", response)
            if (response) {
                const historyWithDates = response
                    .map((item: Evaluation) => ({
                        ...item,
                        timestamp: new Date(item.timestamp),
                        isHistory: true,
                    }))


                // Merge history with session results, maintaining order
                setSessionResults(prev => {
                    const newResults = [...prev, ...historyWithDates,];
                    return newResults
                });
            } else {
                message.error(response?.message || 'Error retrieving history');
            }

        });

        // Listen for errors
        socket.on('error', (error) => {
            console.error('Socket error:', error);
            // You can add additional error handling here
        });

        // Cleanup listeners on unmount
        return () => {
            socket.off('result');
            socket.off('history');
            socket.off('error');
        };
    }, [socket]);



    const clearResults = () => {
        setSessionResults([]);
    };
    const value = {
        socket,
        isConnected,
        sessionResults,
        evaluate,
        getHistory,
        clearResults
    };

    return (
        <ConnectionContext.Provider value={value}>
            {children}
        </ConnectionContext.Provider>
    );
};