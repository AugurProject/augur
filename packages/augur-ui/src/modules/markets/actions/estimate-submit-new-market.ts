import logError from "utils/log-error";
import noop from "utils/noop";
import { buildCreateMarket } from "modules/markets/helpers/build-create-market";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const estimateSubmitNewMarket = (
  newMarket: any,
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { universe, loginAccount, contractAddresses } = getState();
  const { createMarket, formattedNewMarket } = buildCreateMarket(
    newMarket,
    true,
    universe,
    loginAccount,
    contractAddresses,
  );

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
};
