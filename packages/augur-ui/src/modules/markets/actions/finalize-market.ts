import { augur } from "services/augurjs";
import logError from "utils/log-error";
import noop from "utils/noop";
import { ThunkDispatch } from "redux-thunk";
import { NodeStyleCallback } from "modules/types";
import { Action } from "redux";
import { AppState } from "store";

export const sendFinalizeMarket = (marketId, callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  console.log("finalize market called");
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  augur.api.Market.finalize({
    tx: { to: marketId },
    meta: loginAccount.meta,
    onSent: noop,
    onSuccess: () => {
      callback(null);
    },
    onFailed: err => callback(err)
  });
};
