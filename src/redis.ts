import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

export async function setupRedisAdapter(io: any) {
  const url = process.env.REDIS_URL;

  if (!url) {
    console.log("⚠️ No REDIS_URL, running without Redis");
    return;
  }

  console.log("🔴 Connecting to Redis...");

  const pubClient = createClient({
    url, // IMPORTANT: use full URL
  });

  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  console.log("✅ Redis adapter connected");
}
