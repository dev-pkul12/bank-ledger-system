// src/api/webhook.js
import express from "express";
import crypto from "crypto";
import { produceMessage } from "../kafka/producer.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    const payload = req.body;

    // Create deterministic hash (batch idempotency)
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex");

    await produceMessage("transactions-topic", {
      key: payload.accountId, // ensures ordering
      value: JSON.stringify({ payload, hash }),
    });

    return res.status(200).json({ message: "Accepted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Webhook failed" });
  }
});

export default router;
