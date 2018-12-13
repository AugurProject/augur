import { augur } from "services/augurjs";
import { createBigNumber } from "utils/create-big-number";
import { loadAccountTrades } from "modules/positions/actions/load-account-trades";
import logError from "utils/log-error";
import {
  updateTransactionStatus,
  clearTransactionStatus
} from "modules/transactions/actions/update-transactions-status";
import {
  AWAITING_SIGNATURE,
  PENDING
} from "modules/transactions/constants/statuses";
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
    const pendingHash = `pending-${marketId}-${numCompleteSets.fullPrecision}`;
    const sellCompleteSetsParams = {
      tx: {},
      meta: loginAccount.meta,
      _market: marketId,
      _amount: numCompleteSetsOnChain,
      onSent: res => {
        dispatch(updateTransactionStatus(pendingHash, res.hash, PENDING));
        callback(null, res);
      },
      onSuccess: res => {
        dispatch(clearTransactionStatus(pendingHash));
        dispatch(loadAccountTrades({ marketId }));
        callback(null, res);
      },
      onFailed: err => {
        dispatch(clearTransactionStatus(pendingHash));
        callback(err);
      }
    };
    dispatch(updateTransactionStatus(pendingHash, null, AWAITING_SIGNATURE));
    augur.api.CompleteSets.publicSellCompleteSets(sellCompleteSetsParams);
  };
}
