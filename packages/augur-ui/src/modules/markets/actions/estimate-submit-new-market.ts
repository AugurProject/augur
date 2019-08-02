import logError from "utils/log-error";
import noop from "utils/noop";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NEW_MARKET_GAS_ESTIMATE } from "modules/common/constants";

export const estimateSubmitNewMarket = (
  newMarket: any,
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { universe, loginAccount, contractAddresses } = getState();
  // TODO: get market creation gas estimates for now use constant
  callback(null, NEW_MARKET_GAS_ESTIMATE.toString());
};
