// apps/frontend/src/context/ConnectionContext.tsx
import { message } from 'antd';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ActionType, SocketState } from '@calcu-bot/shared';
import { Evaluation, EvaluationResponse, HistoryResponse } from '../types';
import { ResponseStatus } from '@calcu-bot/shared'


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
    const [socket, setSocket] = useState<Socket | null>(null); // Socket internals
    const [isConnected, setIsConnected] = useState(false); // Connection state
    const [sessionResults, setSessionResults] = useState<Array<Evaluation>>([]); // Store all session results


    useEffect(() => {
        // Initialize socket connection with the proxy path
        const socketInstance = io({
            path: '/socket.io',
            transports: ['websocket', 'polling'],
        });

        // Set up event listeners
        socketInstance.on('connect', () => {
            setIsConnected(true);
        });


        socketInstance.on(SocketState.DISCONNECT, () => {
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
            socket.emit(SocketState.MESSAGE, {
                type: ActionType.EVALUATE,
                expression
            }, (error: Error | null) => {
                if (error) {
                    // Handle timeout or other socket errors
                    message.error(`Connection error: ${error.message}`);
                    return;
                }
            });
        } catch (error) {
            message.error(`Failed to send calculation`);
        }
    };

    // apps/frontend/src/context/ConnectionContext.tsx
    const getHistory = () => {
        if (!socket) {
            message.error('Socket connection not available');
            return;
        }

        try {
            socket.emit(SocketState.MESSAGE, {
                type: ActionType.HISTORY
            }, (error: Error | null) => {
                if (error) {
                    // Handle timeout or other socket errors
                    message.error(`Failed to fetch history: ${error.message}`);
                    return;
                }


            });

        } catch (error) {
            message.error(`Failed to request history`);
        }
    };

    // Set up response listeners
    useEffect(() => {
        if (!socket) return;

        // Listen for evaluation results
        socket.on(SocketState.RESULT, (response: EvaluationResponse) => {
            // You can add additional handling here
            const data = response.data;
            if (response.status === ResponseStatus.SUCCESS && data) {
                const newResult = {
                    expression: data.expression,
                    result: data.result,
                    timestamp: new Date(),
                    isHistory: false
                };
                setSessionResults(prev => [...prev, newResult]);

            } else {
                message.error(response.message || 'Error evaluating expression');
            }
        });

        // Listen for history results
        socket.on(SocketState.HISTORY, (response: HistoryResponse) => {
            const data = response.data;

            if (response.status === ResponseStatus.SUCCESS && data) {
                const historyWithDates = data
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
                message.error(response.message || 'Error retrieving history');
            }

        });

        // Listen for errors
        socket.on(SocketState.ERROR, (error) => {
            message.error(error.message);
            // You can add additional error handling here
        });

        // Cleanup listeners on unmount
        return () => {
            socket.off(SocketState.RESULT);
            socket.off(SocketState.HISTORY);
            socket.off(SocketState.ERROR);
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