import { augur } from "services/augurjs";
import logError from "utils/log-error";

export const getDisputeInfo = (
  marketIds: Array<string>,
  callback: Function = logError
) => (dispatch: Function, getState: Function) => {
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
