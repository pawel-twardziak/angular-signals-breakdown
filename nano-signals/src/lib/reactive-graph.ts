export type ProducerNode<T> = {
  value: T;
  liveConsumerNodes: ConsumerNode[];
};

export type ConsumerNode = {
  executor: () => void;
};

export type ComputedNode<T> = Omit<ProducerNode<T>, 'liveConsumerNodes'> & {
  computation: () => T;
  error?: Error;
};

export type EffectNode = ConsumerNode;

let activeConsumer: ConsumerNode | null = null;

export function setActiveConsumer(
  consumer: ConsumerNode | null
): ConsumerNode | null {
  const prev = activeConsumer;
  activeConsumer = consumer;
  return prev;
}

export function getActiveConsumer(): ConsumerNode | null {
  return activeConsumer;
}
