import { BigNumber } from "bignumber.js";
import { Augur } from "../Augur";
import { ContractInterfaces } from "@augurproject/core";

const MAX_PAYOUT = (new BigNumber(2)).pow(256).minus(1);

export interface WarpSyncData {
    warpSyncHash: string;
    timestamp: number;
}

export class WarpSync {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;
  }

  async getWarpSyncMarket(universe: string): Promise<ContractInterfaces.Market> {
    const warpSync = this.augur.contracts.warpSync;
    const warpSyncMarketAddress = await warpSync.markets_(universe);
    return this.augur.contracts.marketFromAddress(warpSyncMarketAddress);
  }

  async getWarpSyncHashFromMarket(market: ContractInterfaces.Market): Promise<string> {
    const winningBondAddress = await market.getWinningReportingParticipant_();
    const winningParticipant = this.augur.contracts.getReportingParticipant(winningBondAddress);
    const payout = await winningParticipant.getPayoutNumerators_();
    return this.getWarpSyncHashFromPayout(payout);
  }

  getWarpSyncHashFromPayout(payout: BigNumber[]): string {
    const hashPayout = payout[2];
    // 0x12 == hashing function of sha2-256 0x20 is the size value. Both are constant and appended at the start of the ipfs hash
    const hexHash = `0x1220${hashPayout.toString(16)}`;
    return new BigNumber(hexHash).toString(58);
  }

  async getPayoutFromWarpSyncHash(warpSyncHash: string): Promise<BigNumber[]> {
    const encodedWarpSyncHash = new BigNumber(warpSyncHash, 58);
    const hexHash = encodedWarpSyncHash.toString(16);
    const payout = new BigNumber(`0x${hexHash.slice(6)}`, 16);
    return [new BigNumber(0), MAX_PAYOUT.minus(payout), payout];
  }

  async getLastWarpSyncData(universe: string): Promise<WarpSyncData> {
    const warpSync = this.augur.contracts.warpSync;
    const warpSyncData = await warpSync.data_(universe);
    return {
        warpSyncHash: warpSyncData.warpSyncHash.toString(10),
        timestamp: warpSyncData.timestamp.toNumber()
    }
  }
}
