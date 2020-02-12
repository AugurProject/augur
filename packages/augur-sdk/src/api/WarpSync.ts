import { BigNumber } from "bignumber.js";
import { Augur } from "../Augur";
import { ContractInterfaces } from "@augurproject/core";
import * as bs58 from "bs58";

const MAX_PAYOUT = (new BigNumber(2)).pow(256).minus(2);

export interface WarpSyncData {
    warpSyncHash: string;
    timestamp: number;
}

export class WarpSync {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;
  }

  async initializeUniverse(universe: string): Promise<void> {
    const warpSync = this.augur.contracts.warpSync;
    await warpSync.initializeUniverse(universe);
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
    const hexHash = `1220${hashPayout.toString(16).padStart(64, "0")}`;
    const bytes = Buffer.from(hexHash, 'hex');
    return bs58.encode(bytes);
  }

  async getPayoutFromWarpSyncHash(warpSyncHash: string): Promise<BigNumber[]> {
    const bytes = bs58.decode(warpSyncHash)
    const encodedWarpSyncHash = bytes.toString('hex');
    // first 6 characters of the hex ipfs hash are always 0x1220
    const payout = new BigNumber(`0x${encodedWarpSyncHash.slice(6)}`, 16);
    return [new BigNumber(0), MAX_PAYOUT.minus(payout), payout];
  }

  async getLastWarpSyncData(universe: string): Promise<WarpSyncData> {
    const warpSync = this.augur.contracts.warpSync;
    const warpSyncData = await warpSync.data_(universe);
    return {
        warpSyncHash: warpSyncData[0].toString(10),
        timestamp: warpSyncData[1].toNumber()
    }
  }
}
