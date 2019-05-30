import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const getDisputeInfo = (
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError,
) => (
  dispatch: ThunkDispatch<{}, {}, Action>,
  getState: () => AppState,
): void => {
  const { loginAccount } = getState();
  augur.augurNode.submitRequest(
    "getDisputeInfo",
    {
      marketIds,
      account: loginAccount.address,
    },
    (err: any, result: any) => {
      if (err) return callback(err);
      callback(null, result);
    },
  );
};
