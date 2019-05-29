import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { AppState } from "store";

export const getDisputeInfo = (
  marketIds: Array<string>,
  callback: Function = logError
) => (dispatch: Function, getState: () => AppState) => {
  const { loginAccount } = getState();
  augur.augurNode.submitRequest(
    "getDisputeInfo",
    {
      marketIds,
      account: loginAccount.address
    },
    (err: any, result: any) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};
