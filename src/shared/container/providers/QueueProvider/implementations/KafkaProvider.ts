import appConsumers from '@infra/consumers';
import { Kafka } from 'kafkajs';

import IQueueConsumer from '../models/IQueueConsumer';
import IQueueMessage from '../models/IQueueMessage';
import IQueueProvider from '../models/IQueueProvider';

export default class KafkaProvider implements IQueueProvider {
  private client: Kafka;

  constructor() {
    this.client = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKERS],
    });
  }

  public async init(): Promise<void> {
    const promises = appConsumers.map(async ({ func, topic }) => {
      await this.consumer({
        topic,
        func,
      });

      console.log(`Consumer ${topic} initialized`);
    });

    await Promise.all(promises);
  }

  public async producer(topic: string, messages: IQueueMessage): Promise<void> {
    const producer = this.client.producer({});

    await producer.connect();

    await producer.send({
      topic: `${process.env.KAFKA_GROUP_ID}-${topic}`,
      messages: [messages],
    });

    await producer.disconnect();
  }

  public async consumer({ topic, func }: IQueueConsumer): Promise<void> {
    try {
      const consumer = this.client.consumer({
        groupId: `${process.env.KAFKA_GROUP_ID}-${topic}`,
      });

      consumer.on('consumer.connect', () => {
        console.log('Consumer is connected');
      });

      consumer.on('consumer.disconnect', () => {
        console.log('Consumer is disconnect');
      });

      await consumer.connect();
      await consumer.subscribe({
        topic: `${process.env.KAFKA_GROUP_ID}-${topic}`,
        fromBeginning: true,
      });
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          await func(message.value);
        },
      });
    } catch (error) {
      console.log({ error });
    }
  }
}
