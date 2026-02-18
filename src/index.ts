import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupRedisAdapter } from "./redis";
import { matchHistory } from "./lib/history";
import "dotenv/config";

const app = express();
app.use(cors());

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  transports: ["polling", "websocket"],
});

// redis setup
async function start() {
  await setupRedisAdapter(io);
}

start();

app.get("/", (_, res) => {
  res.send("Realtime Battle Server Running 🚀");
});

app.get("/matches", (req, res) => {
  res.json(matchHistory);
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});

server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.log("⚠️ Port in use, switching...");
    server.listen(0); // random port
  }
});
