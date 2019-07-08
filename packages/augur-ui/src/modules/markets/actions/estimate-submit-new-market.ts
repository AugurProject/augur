import logError from "utils/log-error";
import noop from "utils/noop";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const estimateSubmitNewMarket = (
  newMarket: any,
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { universe, loginAccount, contractAddresses } = getState();

  // TODO: add call to estimate gas for create market, using crazy number so we know it's mock data
  callback(null, "999999999999999");
  /*
  createMarket({
    ...formattedNewMarket,
    meta: loginAccount.meta,
    onSent: (res: any) => noop,
    onSuccess: (gasCost: any) => {
      callback(null, gasCost);
    },
    onFailed: (err: any) => {
      callback(err);
    },
  });
  */
};
