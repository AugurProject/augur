import { augur } from "services/augurjs";
import { updateLoginAccount } from "modules/account/actions/login-account";
import logError from "utils/log-error";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const updateTopBarPL = (
  options: any = {},
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null);
  augur.augurNode.submitRequest(
    "getProfitLoss",
    {
      universe: universe.id,
      account: loginAccount.address,
      startTime: null,
      endTime: null,
      periodInterval: null,
      marketId: null,
    },
    (err: any, data: any) => {
      if (err) return callback(err);
      dispatch(
        updateLoginAccount({
          // @ts-ignore
          realizedPL: data[data.length - 1].realized,
          realizedPLPercent: data[data.length - 1].realizedPercent,
        }),
      );
    },
  );
};
