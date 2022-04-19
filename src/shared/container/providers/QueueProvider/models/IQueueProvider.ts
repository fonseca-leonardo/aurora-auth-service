import IQueueConsumer from './IQueueConsumer';
import IQueueMessage from './IQueueMessage';

export default interface IQueueProvider {
  init(): Promise<void>;
  producer(topic: string, messages: IQueueMessage): Promise<void>;
  consumer(consumer: IQueueConsumer): Promise<void>;
}
