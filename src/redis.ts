import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { Server } from "socket.io";

export async function setupRedis(io: Server) {
  if (!process.env.REDIS_URL) {
    console.log("⚠️ Redis disabled (no REDIS_URL)");
    return;
  }

  console.log("🔴 Connecting to Redis...");

  const pubClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: true, // IMPORTANT for Railway
      reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
    },
  });

  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  console.log("✅ Redis connected");
}
