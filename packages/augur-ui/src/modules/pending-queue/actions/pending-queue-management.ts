export const ADD_PENDING_DATA = "ADD_PENDING_DATA";
export const REMOVE_PENDING_DATA = "REMOVE_PENDING_DATA";
export const LOAD_PENDING_QUEUE = "LOAD_PENDING_QUEUE";

export const loadPendingQueue = (pendingQueue: any) => ({
  type: LOAD_PENDING_QUEUE,
  data: { pendingQueue }
});

export const addPendingData = (
  pendingId: String,
  queueName: String,
  status: String
) => ({
  type: ADD_PENDING_DATA,
  data: {
    pendingId,
    queueName,
    status
  }
});

export const removePendingData = (pendingId: String, queueName: String) => ({
  type: REMOVE_PENDING_DATA,
  data: { pendingId, queueName }
});
