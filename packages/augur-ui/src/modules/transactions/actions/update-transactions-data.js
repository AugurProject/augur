export const DELETE_TRANSACTION = "DELETE_TRANSACTION";
export const CLEAR_TRANSACTION_DATA = "CLEAR_TRANSACTION_DATA";
export const DELETE_TRANSACTIONS_WITH_TRANSACTION_HASH =
  "DELETE_TRANSACTIONS_WITH_TRANSACTION_HASH";
export const UPDATE_TRANSACTIONS_DATA = "UPDATE_TRANSACTIONS_DATA";

export const deleteTransaction = transactionId => ({
  type: DELETE_TRANSACTION,
  data: { transactionId }
});

export const deleteTransactionsWithTransactionHash = transactionHash => ({
  type: DELETE_TRANSACTIONS_WITH_TRANSACTION_HASH,
  data: { transactionHash }
});

export const clearTransactions = () => ({ type: CLEAR_TRANSACTION_DATA });

export const updateTransactionsData = updatedTransactionsData => ({
  type: UPDATE_TRANSACTIONS_DATA,
  data: { updatedTransactionsData }
});
