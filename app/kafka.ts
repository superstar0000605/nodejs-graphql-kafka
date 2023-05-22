import { Kafka, SASLOptions, Consumer, Producer,  } from 'kafkajs';

type ConfluentCloudCredentials = {
  apiKey: string;
  apiSecret: string;
};

const createKafka = (credentials: ConfluentCloudCredentials): Kafka => {
  const { apiKey, apiSecret } = credentials;
  // Define brokers array from environment variable
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ["pkc-lzvrd.us-west4.gcp.confluent.cloud:9092"],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: apiKey,
      password: apiSecret,
    } as SASLOptions,
    connectionTimeout: 5000,
    requestTimeout: 60000,

  });

  return kafka;
};

const kafka = createKafka({ apiKey: <string>process.env.KAFKA_API_KEY, apiSecret: <string>process.env.KAFKA_API_SECRET });

export const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: 'my-group' })

async function startKafka() {
  await producer.connect();
  console.log('Kafka Producer connected');

  await consumer.connect();
  console.log('Kafka Consumer connected');

  await consumer.subscribe({ topic: <string>process.env.KAFKA_TOPIC });
  console.log(`Subscribed to ${<string>process.env.KAFKA_TOPIC}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value} from ${<string>process.env.KAFKA_TOPIC}`);
      // TODO: process the message and broadcast it to the appropriate chat rooms.
    }
  });
}

export default startKafka;