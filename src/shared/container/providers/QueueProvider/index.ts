import { container } from 'tsyringe';

import IQueueProvider from './models/IQueueProvider';
import KafkaProvider from './implementations/KafkaProvider';

const queueProviderDependency = container.registerInstance<IQueueProvider>(
  'QueueProvider',
  new KafkaProvider(),
);

const queueProvider =
  queueProviderDependency.resolve<IQueueProvider>('QueueProvider');

export default queueProvider;
