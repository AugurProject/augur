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
import { NodeStyleCallback } from 'modules/types';
import { BigNumber } from 'utils/create-big-number';

export const startClaimingMarketsProceeds = (
  marketIds: string[],
  account: string,
  callback: NodeStyleCallback = logError
) => {
  if (!account || !marketIds || !marketIds.length)
    return callback(null);

  let i = 0;
  const groups = [];
  for (i; i < marketIds.length; i += MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT) {
    groups.push(marketIds.slice(i, i + MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT));
  }

  try {
    // TODO: Pass affiliate address to claimMarketsProceeds
    groups.map(group => claimMarketsProceeds(group, account));
  } catch (e) {
    console.error(e);
  }
};

export default claimMarketsProceeds;

export const claimMarketsProceedsGas = async (
  marketIds: string[],
  loginAccount: string
): Promise<BigNumber> => {
  try {
    const value = await claimMarketsProceedsEstimateGas(marketIds, loginAccount);
    console.log('gas estimate', value.toString());
    return value;
  } catch (error) {
    console.error('error could estimate gas', error);
    return CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE;
  }
};
