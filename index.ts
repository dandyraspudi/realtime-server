import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupRedisAdapter } from "./lib/redis";
import { matchHistory } from "./lib/history";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://your-frontend.vercel.app", "*"],
  }
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

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
