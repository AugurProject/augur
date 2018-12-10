import { augur } from "services/augurjs";
import { createBigNumber } from "utils/create-big-number";
import { loadAccountTrades } from "modules/positions/actions/load-account-trades";
import logError from "utils/log-error";
// import noop from "utils/noop";

export function sellCompleteSets(
  marketId,
  numCompleteSets,
  callback = logError
) {
  return (dispatch, getState) => {
    const { loginAccount, marketsData } = getState();
    if (!loginAccount.address) return callback(null);
    const { numTicks, maxPrice, minPrice } = marketsData[marketId];
    const numCompleteSetsOnChain = augur.utils.convertDisplayAmountToOnChainAmount(
      createBigNumber(numCompleteSets.fullPrecision),
      createBigNumber(maxPrice - minPrice),
      numTicks
    );
    const sellCompleteSetsParams = {
      tx: {},
      meta: loginAccount.meta,
      _market: marketId,
      _amount: numCompleteSetsOnChain,
      onSent: res => callback(null, res),
      onSuccess: res => {
        dispatch(loadAccountTrades({ marketId }));
        callback(null, res);
      },
      onFailed: err => callback(err)
    };
    augur.api.CompleteSets.publicSellCompleteSets(sellCompleteSetsParams);
  };
}
