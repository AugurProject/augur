import { BigNumber } from 'ethers/lib/ethers';

export interface AggregateContractResponse {
  blockNumber: BigNumber;
  returnData: string[];
}
