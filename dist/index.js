"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("./redis");
const history_1 = require("./lib/history");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 4000;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["https://your-frontend.vercel.app", "*"],
    }
});
// redis setup
async function start() {
    await (0, redis_1.setupRedisAdapter)(io);
}
start();
app.get("/", (_, res) => {
    res.send("Realtime Battle Server Running 🚀");
});
app.get("/matches", (req, res) => {
    res.json(history_1.matchHistory);
});
server.listen(PORT, () => {
    console.log("Server running on http://localhost:4000");
});
