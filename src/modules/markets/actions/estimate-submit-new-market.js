import logError from "utils/log-error";
import noop from "utils/noop";
import { buildCreateMarket } from "modules/markets/helpers/build-create-market";

export const estimateSubmitNewMarket = (newMarket, callback = logError) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount, contractAddresses } = getState();
  const { createMarket, formattedNewMarket } = buildCreateMarket(
    newMarket,
    true,
    universe,
    loginAccount,
    contractAddresses
  );

  createMarket({
    ...formattedNewMarket,
    meta: loginAccount.meta,
    onSent: res => noop,
    onSuccess: gasCost => {
      callback(null, gasCost);
    },
    onFailed: err => {
      callback(err);
    }
  });
};
