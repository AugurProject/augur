import { deleteTransactionsWithTransactionHash } from "modules/transactions/actions/update-transactions-data";
import { constructTransaction } from "modules/transactions/actions/construct-transaction";

export const updateLoggedTransactions = (log: any) => (
  dispatch: Function,
  getState: Function
) => {
  if (log.removed) {
    dispatch(removeLogFromTransactions(log));
  } else {
    dispatch(addLogToTransactions(log));
  }
};

export const removeLogFromTransactions = (log: any) => (
  dispatch: Function,
  getState: Function
) => {
  if (!log.transactionHash)
    return console.error(
      `transaction hash not found for log ${JSON.stringify(log)}`
    );
  dispatch(deleteTransactionsWithTransactionHash(log.transactionHash));
};

export const addLogToTransactions = (log: any) => (
  dispatch: Function,
  getState: Function
) => {
  if (!log.transactionHash)
    return console.error(
      `transaction hash not found for log ${JSON.stringify(log)}`
    );
  dispatch(constructTransaction(log));
};
