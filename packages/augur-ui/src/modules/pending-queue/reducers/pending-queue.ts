import {
  ADD_PENDING_DATA,
  REMOVE_PENDING_DATA,
} from "modules/pending-queue/actions/pending-queue-management";
import { PendingQueue, BaseAction } from "modules/types";

const DEFAULT_STATE: PendingQueue = {};

export default function(pendingQueue: PendingQueue = DEFAULT_STATE, { type, data }: BaseAction): PendingQueue {
  switch (type) {
    case ADD_PENDING_DATA: {
      const { pendingId, queueName, status, blockNumber, info } = data;
      if (pendingQueue[queueName]) {
        pendingQueue[queueName][pendingId] = {
          status,
          data: info,
          blockNumber,
        };
      } else {
        pendingQueue[queueName] = {};
        pendingQueue[queueName][pendingId] = {
          status,
          data: info,
          blockNumber,
        };
      }

      return {
        ...pendingQueue,
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
