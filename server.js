const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let streamer = null;
let viewer = null;

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    const data = JSON.parse(msg);

    if (data.type === 'register' && data.role === 'streamer') {
      streamer = ws;
      console.log("Streamer connected");
    }

    if (data.type === 'register' && data.role === 'viewer') {
      viewer = ws;
      console.log("Viewer connected");
    }

    // Forward messages between streamer and viewer
    if (data.target === 'viewer' && viewer) {
      viewer.send(JSON.stringify(data));
    }

    if (data.target === 'streamer' && streamer) {
      streamer.send(JSON.stringify(data));
    }
  });

  ws.on('close', () => {
    if (ws === streamer) streamer = null;
    if (ws === viewer) viewer = null;
  });
});

app.get('/', (req, res) => {
  res.send("WebRTC Signalling Server Running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
