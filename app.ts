import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
// @ts-ignore
import { setupWSConnection } from './util.js';

const app = express();
const PORT = 8080;

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', setupWSConnection);

server.listen(PORT, () => {
    console.log("Server is successfully running, and is listening on port " + PORT);
});