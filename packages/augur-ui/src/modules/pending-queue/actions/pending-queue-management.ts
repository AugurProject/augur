import { BaseAction, UIOrder } from "modules/types";

export const ADD_PENDING_DATA = "ADD_PENDING_DATA";
export const REMOVE_PENDING_DATA = "REMOVE_PENDING_DATA";
export const LOAD_PENDING_QUEUE = "LOAD_PENDING_QUEUE";
import { PUBLICTRADE, CANCELORDER } from 'modules/common/constants';

export const loadPendingQueue = (pendingQueue: any): BaseAction => ({
  type: LOAD_PENDING_QUEUE,
  data: { pendingQueue },
});

export const addPendingData = (
  pendingId: string,
  queueName: string,
  status: string,
): BaseAction => ({
  type: ADD_PENDING_DATA,
  data: {
    pendingId,
    queueName,
    status,
  },
});

export const addPendingCreateOrder = (
  pendingId: string,
  status: string,
  order: UIOrder,
  blockNumber: number
) => ({
  type: ADD_PENDING_DATA,
  data: {
    pendingId,
    PUBLICTRADE,
    status,
    parameters: order,
    blockNumber,
  },
})

export const addPendingOrderCancellation = (
  orderId: string,
  status: string,
  blockNumber: number
) => ({
  type: ADD_PENDING_DATA,
  data: {
    orderId,
    CANCELORDER,
    status,
    blockNumber,
  },
})

export const removePendingData = (
  pendingId: string,
  queueName: string,
): BaseAction => ({
  type: REMOVE_PENDING_DATA,
  data: { pendingId, queueName },
});
