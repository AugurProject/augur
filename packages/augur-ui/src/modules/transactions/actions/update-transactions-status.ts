export const UPDATE_TRANSACTION_STATUS = "UPDATE_TRANSACTION_STATUS";
export const CLEAR_TRANSACTION_STATUS = "CLEAR_TRANSACTION_STATUS";

export const updateTransactionStatus = (
  pendingId: String,
  transactionHash: String,
  status: String
) => ({
  type: UPDATE_TRANSACTION_STATUS,
  data: { pendingId, transactionHash, status }
});

export const clearTransactionStatus = (pendingId: String) => ({
  type: CLEAR_TRANSACTION_STATUS,
  data: { pendingId }
});
