import { ContractAPI } from '..';
import { formatBytes32String } from 'ethers/utils';
import { generateAddress } from './util';

export async function getMarketIds(user: ContractAPI, num: number): Promise<Array<string>> {
  const marketIds = [];

  const marketFactoryAddress = await user.augur.contracts.augur.lookup_(formatBytes32String("MarketFactory"));
  const marketFactoryNonce = await user.provider.provider.getTransactionCount(marketFactoryAddress);
  
  for (let offset = 1; offset <= num; offset++) {
      const nonce = marketFactoryNonce - offset;
      if (nonce < 1) break;
      marketIds.push(generateAddress(marketFactoryAddress, nonce));
  }

  return marketIds;
}
