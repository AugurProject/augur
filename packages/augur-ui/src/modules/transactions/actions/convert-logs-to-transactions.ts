import { deleteTransactionsWithTransactionHash } from "modules/transactions/actions/update-transactions-data";
import { constructTransaction } from "modules/transactions/actions/construct-transaction";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";

// TODO: when integrating with SDK need to use SDK's log types
export const updateLoggedTransactions = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  if (log.removed) {
    dispatch(removeLogFromTransactions(log));
  } else {
    dispatch(addLogToTransactions(log));
  }
};

export const removeLogFromTransactions = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  if (!log.transactionHash)
    return console.error(
      `transaction hash not found for log ${JSON.stringify(log)}`,
    );
  dispatch(deleteTransactionsWithTransactionHash(log.transactionHash));
};

export const addLogToTransactions = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  if (!log.transactionHash)
    return console.error(
      `transaction hash not found for log ${JSON.stringify(log)}`,
    );
  dispatch(constructTransaction(log));
};
