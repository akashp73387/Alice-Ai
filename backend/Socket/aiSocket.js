import { WebSocketServer } from "ws";
import crypto from "crypto";
import http from "http";

export const setupSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    const clientId = crypto.randomUUID(); // Optional: Generate client ID
    console.log("User connected:", clientId);

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data); // assuming client sends JSON
        console.log("Received message:", msg);

        const echoResponse = `Autointelli Say: ${msg.message}`;
        ws.send(
          JSON.stringify({ type: "bot_response", message: echoResponse })
        );
      } catch (error) {
        console.error("Error handling message:", error.message);
        ws.send(
          JSON.stringify({
            type: "bot_response",
            message: "Sorry, something went wrong.",
          })
        );
      }
    });

    ws.on("close", () => {
      console.log("User disconnected:", clientId);
    });
  });
};
