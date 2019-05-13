import { augur } from "services/augurjs";
import { updateLoggedTransactions } from "modules/transactions/actions/convert-logs-to-transactions";

export const defaultLogHandler = (log: any) => (dispatch: Function, getState: Function) => {
  if (log.transactionHash == null)
    return console.error("transaction hash not found", log);
  augur.rpc.eth.getTransactionByHash(
    [log.transactionHash],
    (err: any, transaction: any) => {
      if (err) return console.error(err);
      const isOwnTransaction =
        transaction.from === getState().loginAccount.address;
      if (isOwnTransaction) {
        dispatch(updateLoggedTransactions(log));
      }
    }
  );
};
