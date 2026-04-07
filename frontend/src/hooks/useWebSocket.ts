import { useState, useEffect } from 'react';

interface WebSocketMessage {
    type: 'progress' | 'complete' | 'error';
    data: any;
}

interface UseWebSocketOptions {
    onMessage?: (message: WebSocketMessage) => void;
    onError?: (error: Event) => void;
    onOpen?: () => void;
    onClose?: () => void;
    reconnect?: boolean;
    reconnectInterval?: number;
    reconnectAttempts?: number;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [reconnectCount, setReconnectCount] = useState(0);

    const {
        onMessage,
        onError,
        onOpen,
        onClose,
        reconnect = true,
        reconnectInterval = 3000,
        reconnectAttempts = 5,
    } = options;

    useEffect(() => {
        let socket: WebSocket | null = null;
        let reconnectTimeout: ReturnType<typeof setTimeout>;

        const connect = () => {
            try {
                socket = new WebSocket(url);

                socket.onopen = () => {
                    setIsConnected(true);
                    setReconnectCount(0);
                    onOpen?.();
                };

                socket.onmessage = (event) => {
                    try {
                        const message: WebSocketMessage = JSON.parse(event.data);
                        onMessage?.(message);
                    } catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                };

                socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    onError?.(error);
                };

                socket.onclose = () => {
                    setIsConnected(false);
                    onClose?.();

                    // Attempt to reconnect
                    if (
                        reconnect &&
                        reconnectCount < reconnectAttempts &&
                        socket?.readyState === WebSocket.CLOSED
                    ) {
                        reconnectTimeout = setTimeout(() => {
                            setReconnectCount((prev) => prev + 1);
                            connect();
                        }, reconnectInterval * Math.pow(2, reconnectCount)); // Exponential backoff
                    }
                };

                setWs(socket);
            } catch (error) {
                console.error('Failed to create WebSocket:', error);
            }
        };

        connect();

        return () => {
            clearTimeout(reconnectTimeout);
            if (socket) {
                socket.close();
            }
        };
    }, [url, reconnectCount]);

    const send = (data: any) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not connected');
        }
    };

    const close = () => {
        if (ws) {
            ws.close();
        }
    };

    return { ws, isConnected, send, close, reconnectCount };
}
