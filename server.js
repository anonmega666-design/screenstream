import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// When a device connects
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    // Send the received data to every other client
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});

app.get("/", (req, res) => {
  res.send("✅ WebSocket signaling server is running");
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
