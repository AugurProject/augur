export const ADD_PENDING_DATA = "ADD_PENDING_DATA";
export const REMOVE_PENDING_DATA = "REMOVE_PENDING_DATA";
export const LOAD_PENDING_QUEUE = "LOAD_PENDING_QUEUE";

export const loadPendingQueue = pendingQueue => ({
  type: LOAD_PENDING_QUEUE,
  data: { pendingQueue }
});

export const addPendingData = (pendingId, queueName, status) => ({
  type: ADD_PENDING_DATA,
  data: {
    pendingId,
    queueName,
    status
  }
});

export const removePendingData = (pendingId, queueName) => ({
  type: REMOVE_PENDING_DATA,
  data: { pendingId, queueName }
});
