import { updateLoggedTransactions } from "modules/transactions/actions/convert-logs-to-transactions";
import { getTransaction } from "modules/contracts/actions/contractCalls";

export const defaultLogHandler = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: Function
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
