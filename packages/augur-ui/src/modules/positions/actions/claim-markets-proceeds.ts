import { eachOfLimit } from 'async-es';
import noop from 'utils/noop';
import logError from 'utils/log-error';
// Note: the returns: "null" is due to this geth bug: https://github.com/ethereum/go-ethereum/issues/16999. By including this and a hardcoded gas estimate we bypass any eth_call usage and avoid sprurious failures
import {
  addPendingData,
  removePendingData,
} from 'modules/pending-queue/actions/pending-queue-management';
import { CLAIM_PROCEEDS, CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE,  PENDING, SUCCESS } from 'modules/common/constants';
import { claimMarketsProceeds } from 'modules/contracts/actions/contractCalls';
import { AppState } from 'store';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

export const CLAIM_MARKETS_PROCEEDS_GAS_LIMIT = 3000000;

// export const claimTradingProceeds = (marketId, callback: NodeStyleCallback = logError) => async (
//   dispatch: ThunkDispatch<void, any, Action>,
//   getState: () => AppState
// ) => {
//   const { loginAccount } = getState();
//   if (!loginAccount.address || !marketId) return callback(null);

//   // TODO: allow users to claim trading winnings
//   /*
//   api.ClaimTradingProceeds.claimTradingProceeds({
//     tx: { gas: CLAIM_SHARES_GAS_COST, returns: "null" },
//     meta: loginAccount.meta,
//     _market: marketId,
//     _shareHolder: loginAccount.address,
//     onSent: () => dispatch(addPendingData(marketId, CLAIM_PROCEEDS, PENDING)),
//     onSuccess: () => {
//       dispatch(addPendingData(marketId, CLAIM_PROCEEDS, SUCCESS));
//       // @ts-ignore
//       dispatch(getWinningBalance([marketId]));
//       callback();
//     },
//     onFailed: (err: any) => {
//       dispatch(removePendingData(marketId, CLAIM_PROCEEDS));
//       callback(err);
//     },
//   });
//   */
// };

export const startClaimingMarketsProceeds = (
  marketIds: string[],
  callback: NodeStyleCallback = logError
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount } = getState();
  if (!loginAccount.address || !marketIds || !marketIds.length)
    return callback(null);

  MAX_CLAIM_MARKETS_PROCEEDS_COUNT = CLAIM_SHARES_GAS_COST
  let i = 0;
  const groups = [];
  for (i; i < orders.length; i += MAX_CLAIM_MARKETS_PROCEEDS_COUNT) {
    groups.push(orders.slice(i, i + MAX_BULK_ORDER_COUNT));
  }
  try {
    // TODO: Pass affiliate address to claimMarketsProceeds
    groups.map(group => claimMarketsProceeds(group, loginAccount.address, ''));
  } catch (e) {
    console.error(e);
  }

  // TODO: allow user to claim multiple winnings
  /*
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
          // @ts-ignore
          dispatch(getWinningBalance([marketId]));
          seriesCB(null);
        },
        onFailed: (err: any) => seriesCB(err),
      });
    },
    (err) => {
      if (err !== null) console.error("ERROR: ", err);
      callback(err);
    },
  );
  */
};

export default claimMarketsProceeds;
