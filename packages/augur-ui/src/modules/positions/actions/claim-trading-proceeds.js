import { augur } from "services/augurjs";
import { loadMarketsInfo } from "modules/markets/actions/load-markets-info";
import { getWinningBalance } from "modules/reports/actions/get-winning-balance";
import noop from "utils/noop";
import logError from "utils/log-error";
// Note: the returns: "null" is due to this geth bug: https://github.com/ethereum/go-ethereum/issues/16999. By including this and a hardcoded gas estimate we bypass any eth_call usage and avoid sprurious failures

export const CLAIM_SHARES_GAS_COST = 3000000;

const claimTradingProceeds = (marketId, callback = logError) => (
  dispatch,
  getState
) => {
  const { loginAccount } = getState();
  if (!loginAccount.address || !marketId) return callback(null);

  augur.api.ClaimTradingProceeds.claimTradingProceeds({
    tx: { gas: CLAIM_SHARES_GAS_COST, returns: "null" },
    meta: loginAccount.meta,
    _market: marketId,
    _shareHolder: loginAccount.address,
    onSent: noop,
    onSuccess: () => {
      dispatch(getWinningBalance([marketId]));
      dispatch(loadMarketsInfo([marketId]));
    },
    onFailed: err => callback(err)
  });
};

export default claimTradingProceeds;
