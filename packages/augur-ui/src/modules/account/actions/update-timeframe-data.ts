import { augur } from "services/augurjs";
import { updateLoginAccount } from "modules/account/actions/login-account";
import logError from "utils/log-error";
import { TimeframeData, LoginAccount } from "modules/types";

export const updateTimeframeData = (
  options: any = {},
  callback: any = logError
) => (dispatch: Function, getState: Function) => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null);

  augur.augurNode.submitRequest(
    "getAccountTimeRangedStats",
    {
      account: loginAccount.address,
      universe: universe.id,
      startTime: options.startTime || null,
      endTime: null
    },
    (err, timeframeData: TimeframeData) => {
      if (err) return callback(err);
      dispatch(updateLoginAccount({ timeframeData }));
    }
  );
};
