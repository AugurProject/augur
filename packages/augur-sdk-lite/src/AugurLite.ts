import { ethers } from "ethers";
import { HotLoading, HotLoadMarketInfo } from "./api/HotLoading";

export class AugurLite {
  
    readonly hotLoading: HotLoading;

    constructor(
      readonly provider: ethers.providers.Provider,
    ) {
      this.provider = provider;
      this.hotLoading = new HotLoading(this);
    }

    async hotloadMarket(marketId: string): Promise<HotLoadMarketInfo> {
        return this.hotLoading.getMarketDataParams({ market: marketId });
    }
}