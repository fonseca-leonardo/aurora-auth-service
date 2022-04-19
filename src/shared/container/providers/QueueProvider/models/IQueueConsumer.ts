export default interface IQueueConsumer {
  topic: string;
  func: (value: Buffer | null) => Promise<void> | void;
}
