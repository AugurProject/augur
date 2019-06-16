import { updateLoggedTransactions } from "modules/transactions/actions/convert-logs-to-transactions";
import { getTransaction } from "modules/contracts/actions/contractCalls";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";

export const defaultLogHandler = (log: any): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (log.transactionHash == null)
    return console.error("transaction hash not found", log);
  getTransaction(log.transactionHash).then((transaction: any) => {
    const isOwnTransaction =
      transaction.from === getState().loginAccount.address;
    if (isOwnTransaction) {
      dispatch(updateLoggedTransactions(log));
    }
  });
};
