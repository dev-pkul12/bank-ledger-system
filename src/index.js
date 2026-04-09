import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import webhookRoutes from "./api/webhook.js";
import { initProducer } from "./kafka/producer.js";
import { startConsumer } from "./workers/consumer.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", webhookRoutes);

const startServer = async () => {
  try {
    // MongoDB connect
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Kafka producer
    await initProducer();

    // Kafka consumer
    await startConsumer();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Startup Error:", err);
  }
};

startServer();
