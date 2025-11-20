const express = require("express");
const path = require("path");
const WebSocket = require("ws"); 

const app = express();
const PORT = 3000;

// Serve static files (our chat page) 
app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

// WebSocket server
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("New client connected");
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});
