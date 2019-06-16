import { augur } from "services/augurjs";
import { updateLoginAccount } from "modules/account/actions/login-account";
import logError from "utils/log-error";
import { TimeframeData } from "modules/types";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const updateTimeframeData = (
  options: any = {},
  callback: any = logError,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState): void => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null);

  augur.augurNode.submitRequest(
    "getAccountTimeRangedStats",
    {
      account: loginAccount.address,
      universe: universe.id,
      startTime: options.startTime || null,
      endTime: null,
    },
    (err, timeframeData: TimeframeData) => {
      if (err) return callback(err);
      dispatch(updateLoginAccount({ timeframeData }));
    },
  );
};
