import { augur } from "services/augurjs";
import logError from "src/utils/log-error";

export const LOAD_USER_SHARE_BALANCES = "LOAD_USER_SHARE_BALANCES";

export const loadUsershareBalances = (
  marketIds: Array<String>,
  callback: Function = logError
) => (dispatch: Function, getState: Function) => {
  const { loginAccount } = getState();
  if (loginAccount.address == null) return callback(null);
  augur.augurNode.submitRequest(
    "getUserShareBalances",
    {
      marketIds,
      account: loginAccount.address
    },
    (err: any, data: any) => {
      if (err) return callback(err);
      dispatch({ type: LOAD_USER_SHARE_BALANCES, data });
      callback(null, data);
    }
  );
};

export default loadUsershareBalances;
