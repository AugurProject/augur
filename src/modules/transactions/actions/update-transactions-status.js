export const UPDATE_TRANSACTION_STATUS = "UPDATE_TRANSACTION_STATUS";
export const CLEAR_TRANSACTION_STATUS = "CLEAR_TRANSACTION_STATUS";

export const updateTransactionStatus = (
  pendingId,
  transactionHash,
  status
) => ({
  type: UPDATE_TRANSACTION_STATUS,
  data: { pendingId, transactionHash, status }
});

export const clearTransactionStatus = pendingId => ({
  type: CLEAR_TRANSACTION_STATUS,
  data: { pendingId }
});
