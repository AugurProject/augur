import { augur } from "services/augurjs";
import { getWinningBalance } from "modules/reports/actions/get-winning-balance";
import { eachOfLimit } from "async";
import noop from "utils/noop";
import logError from "utils/log-error";
// Note: the returns: "null" is due to this geth bug: https://github.com/ethereum/go-ethereum/issues/16999. By including this and a hardcoded gas estimate we bypass any eth_call usage and avoid sprurious failures
import {
  addPendingData,
  removePendingData
} from "modules/pending-queue/actions/pending-queue-management";
import {
  CLAIM_PROCEEDS,
  PENDING,
  SUCCESS
} from "modules/common-elements/constants";

export const CLAIM_SHARES_GAS_COST = 3000000;

const claimTradingProceeds = (marketId, callback = logError) => (
  dispatch,
  getState
) => {
  const { loginAccount } = getState();
  if (!loginAccount.address || !marketId) return callback(null);
  dispatch(addPendingData(marketId, CLAIM_PROCEEDS, PENDING));

  augur.api.ClaimTradingProceeds.claimTradingProceeds({
    tx: { gas: CLAIM_SHARES_GAS_COST, returns: "null" },
    meta: loginAccount.meta,
    _market: marketId,
    _shareHolder: loginAccount.address,
    onSent: noop,
    onSuccess: () => {
      dispatch(addPendingData(marketId, CLAIM_PROCEEDS, SUCCESS));
      dispatch(getWinningBalance([marketId]));
      callback();
    },
    onFailed: err => {
      dispatch(removePendingData(marketId, CLAIM_PROCEEDS));
      callback(err);
    }
  });
};

export const claimMultipleTradingProceeds = (
  marketIds,
  callback = logError
) => (dispatch, getState) => {
  const { loginAccount } = getState();
  if (!loginAccount.address || !marketIds || !marketIds.length)
    return callback(null);

  eachOfLimit(
    marketIds,
    1,
    (marketId, index, seriesCB) => {
      augur.api.ClaimTradingProceeds.claimTradingProceeds({
        tx: { gas: CLAIM_SHARES_GAS_COST, returns: "null" },
        meta: loginAccount.meta,
        _market: marketId,
        _shareHolder: loginAccount.address,
        onSent: noop,
        onSuccess: () => {
          dispatch(getWinningBalance([marketId]));
          seriesCB(null);
        },
        onFailed: err => seriesCB(err)
      });
    },
    err => {
      if (err !== null) console.error("ERROR: ", err);
      callback(err);
    }
  );
};

export default claimTradingProceeds;
