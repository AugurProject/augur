import {
  ADD_PENDING_DATA,
  REMOVE_PENDING_DATA,
  REMOVE_PENDING_DATA_BY_HASH,
  UPDATE_PENDING_DATA_BY_HASH
} from "modules/pending-queue/actions/pending-queue-management";
import { PendingQueue, BaseAction } from "modules/types";
import { CLEAR_LOGIN_ACCOUNT } from "modules/account/actions/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";
import deepClone from "utils/deep-clone";

const DEFAULT_STATE: PendingQueue = {};

export default function(pendingQueue: PendingQueue = deepClone<PendingQueue>(DEFAULT_STATE), { type, data }: BaseAction): PendingQueue {
  switch (type) {
    case ADD_PENDING_DATA: {
      const { pendingId, queueName, status, blockNumber, hash, info } = data;
      return {
        ...pendingQueue,
        [queueName]: {
          ...pendingQueue[queueName],
          [pendingId]: {
            status,
            data: info,
            hash,
            blockNumber,
          },
        },
      };
    }
    case REMOVE_PENDING_DATA_BY_HASH: {
      const { hash, queueName } = data;
      let pending = pendingQueue;
      if (pendingQueue[queueName]) {
        const queue = pendingQueue[queueName];
        pending[queueName] = Object.keys(queue).reduce(
          (p, o) => (queue[o].hash !== hash ? { ...p, [o]: queue[o] } : p),
          {}
        );
      }
      return {
        ...pending,
      };
    }
    case UPDATE_PENDING_DATA_BY_HASH: {
      const { oldHash, newHash, queueName, blockNumber, status } = data;
      let pending = pendingQueue;
      if (pendingQueue[queueName]) {
        const queue = pendingQueue[queueName];
        Object.keys(queue).forEach(o => {
          const item = queue[o];
          if (item.hash === oldHash || item.hash === newHash) {
            item.hash = newHash;
            item.blockNumber = blockNumber;
            item.status = status;
          }
        });
      }
      return {
        ...pending,
      };
    }
    case REMOVE_PENDING_DATA: {
      const { pendingId, queueName } = data;
      let pending = pendingQueue;
      if (pendingQueue[queueName] && pendingQueue[queueName][pendingId]) {
        delete pending[queueName][pendingId];
      }
      return {
        ...pending,
      };
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return pendingQueue;
  }
}
