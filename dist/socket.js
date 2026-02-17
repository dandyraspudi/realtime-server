"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocket = registerSocket;
const battle_engines_1 = require("./battle-engines");
const history_1 = require("./lib/history");
const rooms = {};
function startTurnTimer(io, room) {
    if (room.timer)
        clearTimeout(room.timer);
    room.timer = setTimeout(() => {
        if (room.winner) {
            clearTimeout(room.timer);
            endMatch(room);
            return;
        }
        const current = room.turn;
        const next = room.players.find((p) => p.id !== current);
        if (!next)
            return;
        room.battleLog.push("Turn skipped (timeout)");
        room.turn = next.id;
        io.to(room.id).emit("battle:update", room);
        // 🔁 RECURSIVE TIMER
        startTurnTimer(io, room);
    }, 10000);
}
function registerSocket(io) {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        // CREATE ROOM
        socket.on("create-room", ({ name }, callback) => {
            const roomId = Math.random().toString(36).slice(2, 8);
            const room = {
                id: roomId,
                players: [{ id: socket.id, name, hp: 100 }],
                turn: socket.id,
                battleLog: [],
                winner: null,
            };
            rooms[roomId] = room;
            socket.join(roomId);
            callback(roomId);
        });
        // JOIN ROOM
        socket.on("join-room", ({ roomId, name, playerId }, callback) => {
            const room = rooms[roomId];
            if (!room)
                return callback({ error: "Room not found" });
            if (room.players.length >= 2)
                return callback({ error: "Room full" });
            const existing = room.players.find((p) => p.id === playerId);
            if (existing) {
                existing.id = socket.id; // reconnect bind
            }
            else {
                room.players.push({ id: socket.id, name, hp: 100 });
            }
            socket.join(roomId);
            io.to(roomId).emit("battle:update", room);
            if (room.players.length === 2) {
                startTurnTimer(io, room);
            }
            callback({ success: true });
        });
        const lastAttack = new Map();
        // ATTACK EVENT
        socket.on("attack", ({ roomId }) => {
            const room = rooms[roomId];
            const now = Date.now();
            const last = lastAttack.get(socket.id) || 0;
            //   check attack cooldown (1 sec) | spam prevention
            if (now - last < 1000)
                return; // 1 sec cooldown
            lastAttack.set(socket.id, now);
            if (!room)
                return;
            if (room.turn !== socket.id)
                return; // anti cheat
            const updatedRoom = (0, battle_engines_1.attack)(room, socket.id);
            startTurnTimer(io, updatedRoom);
            io.to(roomId).emit("battle:update", updatedRoom);
        });
        // DISCONNECT
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
        socket.on("watch-room", ({ roomId }) => {
            socket.join(roomId);
        });
    });
}
function endMatch(room) {
    if (!room.winner)
        return;
    (0, history_1.saveMatch)({
        roomId: room.id,
        players: room.players.map((p) => p.name),
        winner: room.winner,
        date: new Date(),
    });
}
