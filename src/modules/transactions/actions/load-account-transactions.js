import logError from "utils/log-error";
import { augur } from "services/augurjs";

export const loadAccountTransactions = (options, callback = logError) => (
  dispatch,
  getState
) => {
  const { loginAccount, universe } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null);

  augur.augurNode.submitRequest(
    "getAccountTransactionHistory",
    { ...options, account: loginAccount.address, universe: universe.id },
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};
