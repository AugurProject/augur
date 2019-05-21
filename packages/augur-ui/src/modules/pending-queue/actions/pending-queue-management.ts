export const ADD_PENDING_DATA = "ADD_PENDING_DATA";
export const REMOVE_PENDING_DATA = "REMOVE_PENDING_DATA";
export const LOAD_PENDING_QUEUE = "LOAD_PENDING_QUEUE";

export const loadPendingQueue = (pendingQueue: any) => ({
  type: LOAD_PENDING_QUEUE,
  data: { pendingQueue }
});

export const addPendingData = (
  pendingId: string,
  queueName: string,
  status: string
) => ({
  type: ADD_PENDING_DATA,
  data: {
    pendingId,
    queueName,
    status
  }
});

export const removePendingData = (pendingId: string, queueName: string) => ({
  type: REMOVE_PENDING_DATA,
  data: { pendingId, queueName }
});
