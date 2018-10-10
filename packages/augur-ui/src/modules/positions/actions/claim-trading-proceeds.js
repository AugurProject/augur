import { each } from "async";
import { augur } from "services/augurjs";
import { loadMarketsInfo } from "modules/markets/actions/load-markets-info";
import { cancelOpenOrdersInClosedMarkets } from "modules/orders/actions/cancel-order";
import selectWinningPositions from "modules/positions/selectors/winning-positions";
import { getWinningBalance } from "modules/reports/actions/get-winning-balance";
import noop from "utils/noop";
import logError from "utils/log-error";

// Note: the returns: "null" is due to this geth bug: https://github.com/ethereum/go-ethereum/issues/16999. By including this and a hardcoded gas estimate we bypass any eth_call usage and avoid sprurious failures

const CLAIM_SHARES_GAS_COST = 3000000;

const claimTradingProceeds = (marketIds, callback = logError) => (
  dispatch,
  getState
) => {
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  const winningPositions = selectWinningPositions();
  const markets =
    !marketIds || marketIds.length === 0
      ? winningPositions.map(winningPosition => winningPosition.id)
      : marketIds;
  if (markets.length > 0) {
    each(markets, marketId => {
      augur.api.ClaimTradingProceeds.claimTradingProceeds({
        tx: { gas: CLAIM_SHARES_GAS_COST, returns: "null" },
        meta: loginAccount.meta,
        _market: marketId,
        _shareHolder: loginAccount.address,
        onSent: noop,
        onSuccess: claimedMarkets => {
          dispatch(getWinningBalance([marketId]));
          dispatch(loadMarketsInfo([marketId]));
        },
        onFailed: err => callback(err)
      });
    });
  }
  // has claimed proceeds on all finalized markets so close open orders
  if (!marketIds) {
    dispatch(cancelOpenOrdersInClosedMarkets());
  }
};

export default claimTradingProceeds;
