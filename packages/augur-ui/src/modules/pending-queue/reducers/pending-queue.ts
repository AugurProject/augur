import {
  ADD_PENDING_DATA,
  REMOVE_PENDING_DATA,
  REMOVE_PENDING_DATA_BY_HASH
} from "modules/pending-queue/actions/pending-queue-management";
import { PendingQueue, BaseAction } from "modules/types";

const DEFAULT_STATE: PendingQueue = {};

export default function(pendingQueue: PendingQueue = DEFAULT_STATE, { type, data }: BaseAction): PendingQueue {
  switch (type) {
    case ADD_PENDING_DATA: {
      const { pendingId, queueName, status, blockNumber, hash, info } = data;
      if (pendingQueue[queueName]) {
        pendingQueue[queueName][pendingId] = {
          status,
          data: info,
          hash,
          blockNumber,
        };
      } else {
        pendingQueue[queueName] = {};
        pendingQueue[queueName][pendingId] = {
          status,
          data: info,
          hash,
          blockNumber,
        };
      }

      return {
        ...pendingQueue,
      };
    }
    case REMOVE_PENDING_DATA_BY_HASH: {
      const { hash, queueName } = data;
      let pending = pendingQueue;
      if (pendingQueue[queueName]) {
        const queue = pendingQueue[queueName];
        pending[queueName] = Object.keys(queue).reduce(
          (p, o) => (queue[o].hash !== hash ? {...p, [o]: queue[o]} : p),
          {}
        );
      }
      return {
        ...pending,
      };
    }
    case REMOVE_PENDING_DATA: {
      const { pendingId, queueName } = data;
      if (pendingQueue[queueName] && pendingQueue[queueName][pendingId]) {
        delete pendingQueue[queueName][pendingId];
      }
      return {
        ...pendingQueue,
      };
    }
    default:
      return pendingQueue;
  }
}
