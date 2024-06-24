import express from "express";
import config from "./config"; // Assuming you have a valid config.ts file
import cors from "cors";
import PropertRoute from "./controllers/PropertyController";
import AdminRoute from "./controllers/AdminController";
import UserRouter from "./controllers/UserController";
import typeOrm from "./db";
import path from "path";
import { ErrorHandler } from "./middleware/ErrorHandler";
import { AuthHandler } from "./middleware/AuthHandler";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);

// 🌐  WebSocket Initialization which will be used for socket.io for creating websocket server instance
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle custom events
  socket.on("message", (msg) => {
    console.log("Message received:", msg);
    // Broadcast the message to all connected clients
    io.emit("message", msg);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});
(async () => {
  try {
    await typeOrm.initialize();
    // Your database initialization logic

    httpServer.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.log("Error in server initialization", error);
  }
})();

app.use(express.static(path.join(__dirname, "asserts")));

// 🌐  CORS - Cross-Origin Resource Sharing
// Allows cross-origin requests in the development environment.
app.use(cors());

// 📦  express.json() - Request Body Parsing
// Parses incoming requests with JSON payloads.
app.use(express.json());

// Optional: Health check endpoint
app.get("/health", (req, res) => {
  // Respond with a JSON object indicating the health status of the server
  res.json({
    status: "UP",
    message: "Server is healthy",
  });
});
/**
 * ✅ Router initialization start
 */
app.use(AuthHandler);

app.use("/api/properties", PropertRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/users", UserRouter);

app.use(ErrorHandler);
