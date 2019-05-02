import { augur } from "services/augurjs";
import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import logError from "utils/log-error";

export const updateTimeframeData = (options = {}, callback = logError) => (
  dispatch,
  getState
) => {
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
    (err, timeframeData) => {
      if (err) return callback(err);
      dispatch(
        updateLoginAccount({
          timeframeData
        })
      );
    }
  );
};
