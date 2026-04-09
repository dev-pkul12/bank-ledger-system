import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "ledger-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

export const initProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer Connected");
};

export const produceMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [message],
  });
};
