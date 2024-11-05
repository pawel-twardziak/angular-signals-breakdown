import {
  ComputedNode,
  ConsumerNode,
  EffectNode,
  getActiveConsumer,
  ProducerNode,
  setActiveConsumer,
} from './reactive-graph';

export type Signal<T> = () => T;
export type WritableSignal<T> = Signal<T> & {
  set: (newValue: T) => void;
  update: (fn: (currentValue: T) => T) => void;
  asReadonly: () => Signal<T>;
};

export function signal<T>(initialValue: T): WritableSignal<T> {
  const node: ProducerNode<T> = {
    value: initialValue,
    liveConsumerNodes: [],
  };

  const addActiveConsumerToProducer = () => {
    const activeConsumer = getActiveConsumer();
    if (activeConsumer) {
      if (!node.liveConsumerNodes.includes(activeConsumer)) {
        node.liveConsumerNodes.push(activeConsumer);
      }
    }
    return activeConsumer;
  };

  const signal: WritableSignal<T> = () => {
    addActiveConsumerToProducer();
    return node.value;
  };
  signal.set = (newValue: T) => {
    if (node.value === newValue) {
      return;
    }
    node.value = newValue;
    (node.liveConsumerNodes as ConsumerNode[])?.forEach((consumerNode) => {
      consumerNode.executor();
    });
  };
  signal.update = (updateFn) => {
    const newValue = updateFn(node.value);
    if (node.value === newValue) {
      return;
    }
    node.value = newValue;
    (node.liveConsumerNodes as ConsumerNode[])?.forEach((consumerNode) => {
      consumerNode.executor();
    });
  };
  signal.asReadonly = () => (() => signal()) as Signal<T>;

  return signal;
}

function createReadOnySignal<T>(value: T): Signal<T> {
  const _signal = signal(value);
  return () => _signal();
}

export function computed<T>(computationFn: () => T): Signal<T> {
  const computation = () => {
    try {
      node.value = computationFn();
    } catch (e: any) {
      node.error = e;
    }
    return node.value;
  };

  const node: ComputedNode<T> = {
    value: undefined as T,
    computation: () => {
      node.value = computation();
      return node.value;
    },
  };
  return () => node.computation();
}

export function untracked<T>(untrackedFn: () => T): T {
  const prevActiveConsumer = getActiveConsumer();
  setActiveConsumer(null);
  try {
    return untrackedFn();
  } finally {
    setActiveConsumer(prevActiveConsumer);
  }
}

export function effect(effectFn: () => void) {
  let prevActiveConsumer: ConsumerNode | null = null;

  const executor = () => {
    Promise.resolve().then(() => {
      prevActiveConsumer = getActiveConsumer();
      setActiveConsumer(node);
      try {
        effectFn();
      } finally {
        setActiveConsumer(prevActiveConsumer);
      }
    });
  };

  const node: EffectNode = {
    executor,
  };

  executor(); // by the book, run it at least once
}
