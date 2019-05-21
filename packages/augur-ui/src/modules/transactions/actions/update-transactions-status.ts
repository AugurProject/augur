export const UPDATE_TRANSACTION_STATUS = "UPDATE_TRANSACTION_STATUS";
export const CLEAR_TRANSACTION_STATUS = "CLEAR_TRANSACTION_STATUS";

export const updateTransactionStatus = (
  pendingId: string,
  transactionHash: string,
  status: string
) => ({
  type: UPDATE_TRANSACTION_STATUS,
  data: { pendingId, transactionHash, status }
});

export const clearTransactionStatus = (pendingId: string) => ({
  type: CLEAR_TRANSACTION_STATUS,
  data: { pendingId }
});
