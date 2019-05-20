import { augur } from "services/augurjs";
import { updateLoginAccountAction } from "modules/account/actions/login-account";
import logError from "utils/log-error";

export const updateTimeframeData = (
  options: any = {},
  callback: any = logError,
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
    (err: any, timeframeData: any) => {
      if (err) return callback(err);
      dispatch(updateLoginAccountAction({timeframeData}));
    },
  );
};
