import express from 'express';
import { createServer, IncomingMessage } from 'http';
import { WebSocketServer } from 'ws';
// @ts-ignore
import { setupWSConnection } from './util.js';
import { verifyToken } from './auth.js';

const app = express();
const PORT = 8080;

const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', setupWSConnection);

server.on('upgrade', async (request: IncomingMessage, socket, head) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
        console.debug(`[WS] Rejected upgrade from ${request.socket.remoteAddress} — no token provided`);
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    try {
        await verifyToken(token);
        console.debug(`[WS] Accepted upgrade from ${request.socket.remoteAddress} — token valid`);
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } catch (err) {
        console.debug(`[WS] Rejected upgrade from ${request.socket.remoteAddress} — token invalid: ${(err as Error).message}`);
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
    }
});

server.listen(PORT, () => {
    console.log("Server is successfully running, and is listening on port " + PORT);
});
