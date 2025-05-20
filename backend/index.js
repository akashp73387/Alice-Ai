import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./Database/config.js";
import { setupSocket } from "./Socket/aiSocket.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());


// Connect to MongoDB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to server");
});

// Create HTTP server to bind with Socket.IO
const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server);

// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
