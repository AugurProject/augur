import { ContractAPI } from '..';
import { generateAddress } from './util';
import { ethers } from 'ethers';

export async function getMarketIds(user: ContractAPI, num: number): Promise<Array<string>> {
  const marketIds = [];
  const augur = await user.augur.contracts.getAugur();

  const marketFactoryAddress = await augur.lookup_(ethers.utils.formatBytes32String("MarketFactory"));
  const marketFactoryNonce = await user.provider.provider.getTransactionCount(marketFactoryAddress);

  for (let offset = 1; offset <= num; offset++) {
      const nonce = marketFactoryNonce - offset;
      if (nonce < 1) break;
      marketIds.push(generateAddress(marketFactoryAddress, nonce));
  }

  return marketIds;
}
