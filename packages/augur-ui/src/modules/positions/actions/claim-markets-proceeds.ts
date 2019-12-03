import logError from 'utils/log-error';
// Note: the returns: "null" is due to this geth bug: https://github.com/ethereum/go-ethereum/issues/16999. By including this and a hardcoded gas estimate we bypass any eth_call usage and avoid sprurious failures
import {
  MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT,
  CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE,
} from 'modules/common/constants';
import {
  claimMarketsProceeds,
  claimMarketsProceedsEstimateGas,
} from 'modules/contracts/actions/contractCalls';
import { AppState } from 'store';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

export const startClaimingMarketsProceeds = (
  marketIds: string[],
  callback: NodeStyleCallback = logError
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount } = getState();
  if (!loginAccount.address || !marketIds || !marketIds.length)
    return callback(null);

  let i = 0;
  const groups = [];
  for (i; i < marketIds.length; i += MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT) {
    groups.push(marketIds.slice(i, i + MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT));
  }

  try {
    // TODO: Pass affiliate address to claimMarketsProceeds
    groups.map(group => claimMarketsProceeds(group, loginAccount.address));
  } catch (e) {
    console.error(e);
  }
};

export default claimMarketsProceeds;

export const claimMarketsProceedsGas = (
  marketIds: string[],
  loginAccount: string
) => {
  try {
    return claimMarketsProceedsEstimateGas(marketIds, loginAccount);
  } catch (error) {
    console.error('error could estimate gas', error);
    return CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE;
  }
};
