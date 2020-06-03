import { ethers } from "ethers";
import { HotLoading, HotLoadMarketInfo } from "./api/HotLoading";

export interface Addresses {
  HotLoading: string;
  Augur: string;
  FillOrder: string;
  Orders: string;
}

export class AugurLite {
  
    readonly hotLoading: HotLoading;

    constructor(
      readonly provider: ethers.providers.Provider,
      readonly addresses: Addresses,
    ) {
      this.provider = provider;
      this.hotLoading = new HotLoading(this.provider);
      this.addresses = addresses;
    }

    async hotloadMarket(marketId: string): Promise<HotLoadMarketInfo> {
        return this.hotLoading.getMarketData({
          market: marketId,
          hotLoadingAddress: this.addresses.HotLoading,
          augurAddress: this.addresses.Augur,
          fillOrderAddress: this.addresses.FillOrder,
          ordersAddress: this.addresses.Orders,
        });
    }
}