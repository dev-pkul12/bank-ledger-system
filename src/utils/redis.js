import Redis from "ioredis";

export const redis = new Redis();

// Idempotency check
export const isDuplicate = async (txnId) => {
  const result = await redis.setnx(`txn:${txnId}`, "1");
  return result === 0;
};

// Token bucket rate limiter
export const allowRequest = async () => {
  const key = "global_rate_limit";

  let tokens = await redis.get(key);

  if (!tokens) {
    await redis.set(key, 50, "EX", 1); // reset every second
    tokens = 50;
  }

  if (tokens > 0) {
    await redis.decr(key);
    return true;
  }

  return false;
};
