import { BigNumber } from 'bignumber.js';
import * as bs58 from 'bs58';
import { ethers } from 'ethers';
import { WarpSyncAbi } from '../abi/WarpSyncAbi';

const MAX_PAYOUT = new BigNumber(2).pow(256).minus(2);

export interface WarpSyncData {
  warpSyncHash: string;
  timestamp: number;
}

export class WarpSync {
  private readonly provider: ethers.providers.Provider;
  private readonly contract: ethers.Contract;

  constructor(provider: ethers.providers.Provider, address: string) {
    this.contract = new ethers.Contract(address, WarpSyncAbi, provider);

    this.provider = provider;
  }

  getWarpSyncHashFromPayout(payout: BigNumber): string {
    // 0x12 == hashing function of sha2-256 0x20 is the size value. Both are constant and appended at the start of the ipfs hash
    const hexHash = `1220${payout.toString(16).padStart(64, '0')}`;
    const bytes = Buffer.from(hexHash, 'hex');
    return bs58.encode(bytes);
  }

  async getLastWarpSyncData(universe: string): Promise<WarpSyncData> {
    const [warpSyncHash, timestamp] = await this.contract.data(
      universe
    );

    return {
      warpSyncHash: this.getWarpSyncHashFromPayout(new BigNumber(warpSyncHash.toString())),
      timestamp: timestamp.toNumber(),
    };
  }
}
