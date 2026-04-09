import { Kafka } from "kafkajs";
import { processBatch } from "../services/transactionService.js";

const kafka = new Kafka({ brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "ledger-group" });

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "transactions-topic" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { payload } = JSON.parse(message.value.toString());
      await processBatch(payload);
    },
  });
};
