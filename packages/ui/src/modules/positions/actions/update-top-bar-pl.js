import { augur } from "services/augurjs";
import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import logError from "utils/log-error";

export const updateTopBarPL = (options = {}, callback = logError) => (
  dispatch,
  getState
) => {
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
      marketId: null
    },
    (err, data) => {
      if (err) return callback(err);
      dispatch(
        updateLoginAccount({
          realizedPL: data[data.length - 1].realized,
          realizedPLPercent: data[data.length - 1].realizedPercent
        })
      );
    }
  );
};
