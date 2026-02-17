"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRedisAdapter = setupRedisAdapter;
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
async function setupRedisAdapter(io) {
    const pubClient = (0, redis_1.createClient)({ url: "redis://localhost:6379" });
    const subClient = pubClient.duplicate();
    await pubClient.connect();
    await subClient.connect();
    io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
}
